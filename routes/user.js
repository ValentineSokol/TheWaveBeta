const hashFile = require('../utils/hashFile');
const { Router } = require('express');
const { Users } = require('../models');
const B2 = require('backblaze-b2');
const multer = require('multer');
const sharp = require('sharp');
const auth = require('../middlewares/auth');
const tf = require('@tensorflow/tfjs-node');
const nsfw = require('nsfwjs');
const jpeg = require('jpeg-js');
const nsfwThresholds = require('../utils/nswf/nswfDetectionThresholds');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_KEY_ID, // or accountId: 'accountId'
    applicationKey: process.env.BACKBLAZE_KEY // or masterApplicationKey
  });

let nsfwImageDetectionModal;

const analyzeImageForNSFW = async (img, res) => {
    if (!nsfwImageDetectionModal) {
        nsfwImageDetectionModal = await nsfw.load(`https://thewavefiles.s3.us-west-002.backblazeb2.com/nsfwDetectionModel/`, { size: 299 });
    }
    const { data } = await sharp(img).jpeg().toBuffer({ resolveWithObject: true });
    const image = jpeg.decode(data, { useTArray: true });

    const numChannels = 3
    const numPixels = image.width * image.height
    const values = new Int32Array(numPixels * numChannels)

    for (let i = 0; i < numPixels; i++)
        for (let c = 0; c < numChannels; ++c)
            values[i * numChannels + c] = image.data[i * 4 + c]

    const imageConvertedForTf = await tf.tensor3d(values, [image.height, image.width, numChannels], 'int32');
    const predictions = await nsfwImageDetectionModal.classify(imageConvertedForTf);
    return predictions.find(p => p.className === 'Porn').probability * 100 >= nsfwThresholds.PORN_PERCENTAGE || predictions.find(p => p.className === 'Hentai').probability* 100 >= nsfwThresholds.HENTAI_PERCENTAGE;
}
module.exports = (server) => {
    const router = Router();
    router.put('/files/upload', auth, upload.array('files'), async (req, res) => {
      await b2.authorize();
      const uploads = [];
      for (const file of req.files) {
        let [fileType, fileFormat] = file.mimetype.split('/');
        if (fileType === 'image') {
            const busted = await analyzeImageForNSFW(file.buffer, res);
            if (busted) {
                return res.status(400).json({ success: false, nsfwContentDetected: true });
            }
           return res.sendStatus(200);
           try {
               file.buffer = await sharp(file.buffer).webp({quality: 100, lossless: true}).toFormat('webp').toBuffer();
               file.mimetype = 'image/webp'
               fileFormat = 'webp';
           }
           catch (e) {
               console.error(e);
               return;
           }
        }
        const uploadUrlRes = await b2.getUploadUrl({
          bucketId: process.env.BACKBLAZE_BUCKET_ID
        });
       const hashHex = await hashFile(file.buffer); 
       const fileUploadPromise = b2.uploadFile({
          uploadUrl: uploadUrlRes.data.uploadUrl,
          uploadAuthToken: uploadUrlRes.data.authorizationToken,
          fileName: `${req.user.username}-${hashHex}.${fileFormat}`,
          mime: file.mimetype,
          data: file.buffer, 
       });
       uploads.push(fileUploadPromise);
    } 
    const uploadedFiles = await Promise.allSettled(uploads);
    const urls = uploadedFiles.map(fileInfo => {
      if (fileInfo.status === 'rejected') {
        res.sendStatus(502);
        console.log(fileInfo.reason.response.data.message);
        return;
      }
      if (!fileInfo.value ||!fileInfo.value.data)  {
        res.sendStatus(502);
        return;
      };
      return `https://thewavefiles.s3.us-west-002.backblazeb2.com/${fileInfo.value.data.fileName}`;
    });
    res.json({ success: true, urls });
  });
    router.get('/profile/:id', async (req, res) => {
      const { id } = req.params;
      const user = await Users.findByPk(id);
      if (!user) {
          res.status(404).json({
              reason: 'No user with that id found!'
          });
          return;
      }
      res.json({ user });  
    });
    router.patch('/update', auth, async (req, res) => {
      const { avatarUrl } = req.body;
      const fieldsToUpdate = {};
      if (avatarUrl) fieldsToUpdate.avatarUrl = avatarUrl;
      const user = await Users.findByPk(req.user.id);
      await user.update(fieldsToUpdate);
      res.json({ id: req.user.id }) 
    });
    return router;
}
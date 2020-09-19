const hashFile = require('../utils/hashFile');
const { Router } = require('express');
const { Users } = require('../models');
const B2 = require('backblaze-b2');
const multer = require('multer');
const auth = require('../middlewares/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_KEY_ID, // or accountId: 'accountId'
    applicationKey: process.env.BACKBLAZE_KEY // or masterApplicationKey
  });
module.exports = (server) => {
    const router = Router();
    router.put('/files/upload', auth, upload.array('files'), async (req, res) => {
      await b2.authorize();
      const uploads = [];
      for (const file of req.files) {
        const uploadUrlRes = await b2.getUploadUrl({
          bucketId: process.env.BACKBLAZE_BUCKET_ID
        });
       const hashHex = await hashFile(file.buffer); 
       const fileUploadPromise = b2.uploadFile({
          uploadUrl: uploadUrlRes.data.uploadUrl,
          uploadAuthToken: uploadUrlRes.data.authorizationToken,
          fileName: `${req.user.username}-${hashHex}`,
          mime: file.mimeType,
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
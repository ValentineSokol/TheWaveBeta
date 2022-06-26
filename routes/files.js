const hashFile = require('../utils/hashFile');
const { Router } = require('express');
const { Files } = require('../models');
const B2 = require('backblaze-b2');
const multer = require('multer');
const sharp = require('sharp');
const auth = require('../middlewares/auth');
const isImageNSFW = require('../utils/nsfw/classifyImage');
const fileConstants = require('../constants/fileConstants');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_KEY_ID,
    applicationKey: process.env.BACKBLAZE_KEY
});

module.exports = (server) => {
    const router = Router();
    router.post('/upload', auth(), upload.array('files'), async (req, res) => {
        await b2.authorize();
        const uploads = [];
        const fileInfos = [];
        for (const file of req.files) {
            let [fileType, fileFormat] = file.mimetype.split('/');
            if (fileType === 'image') {
                try {
                    file.nsfw = await isImageNSFW(file.buffer);
                    file.buffer = await sharp(file.buffer).webp({ quality: 100, lossless: true }).toBuffer();
                    file.mimetype = 'image/webp'
                    fileFormat = 'webp';
                }
                catch (e) {
                    console.error(e);
                    return;
                }
            }
            fileInfos.push({ name: file.filename, mimeType: file.mimetype, nsfw: file.nsfw });
            const uploadUrlRes = await b2.getUploadUrl({
                bucketId: process.env.BACKBLAZE_BUCKET_ID
            });
            const hashHex = await hashFile(file.buffer);
            const fileUploadPromise = b2.uploadFile({
                uploadUrl: uploadUrlRes.data.uploadUrl,
                uploadAuthToken: uploadUrlRes.data.authorizationToken,
                fileName: `${req.user.username}-${hashHex}-${Date.now()}.${fileFormat}`,
                mime: file.mimetype,
                data: file.buffer,
            });
            uploads.push(fileUploadPromise);
        }
        const uploadedFiles = await Promise.allSettled(uploads);
        const urls = uploadedFiles.map(async (fileInfo, i) => {
            if (fileInfo.status === 'rejected') {
                res.sendStatus(502);
                console.log(fileInfo.reason.response.data.message);
                return;
            }
            if (!fileInfo?.value?.data)  {
                res.sendStatus(502);
                return;
            }
            const info = fileInfos[i];
            const record = await Files.create({
                fileId: fileInfo.value.data.fileId,
                owner: req.user.id,
                ...info,
            });
            return `/files/${record.id}`;
        });
        res.json({ success: true, urls: await Promise.all(urls) });
    });
    router.head('/:id', auth(false));
    router.get('/:id', auth(false), async (req, res) => {
        await b2.authorize();
        const { id } = req.params;
        const fileRecord = await Files.findByPk(id);
        if (!fileRecord) {
            res.sendStatus(404);
            return;
        }
        if (fileRecord.visibility !== fileConstants.VISIBILITY.PUBLIC) {

        }
        const { data } = await b2.downloadFileById({
            fileId: fileRecord.fileId,
            responseType: 'arraybuffer'
        });
         res.type(fileRecord.mimeType);
         res.set('Cache-Control', 'private');
         res.set('NSFW-Content', fileRecord.nsfw ? true : '');
         res.end(data, 'binary');
    });
    return router;
}
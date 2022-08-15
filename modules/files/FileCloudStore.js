const crypto = require('crypto');
const streamifier = require('streamifier');
const B2 = require('backblaze-b2');

const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_KEY_ID,
    applicationKey: process.env.BACKBLAZE_KEY
});

const hashFile = (buffer) => new Promise((resolve, reject) => {
    if (!buffer) reject('No Buffer provided!');
    const hash = crypto.createHash('sha3-512');
    const fileReadStream = streamifier.createReadStream(buffer);
    fileReadStream.on('data', data => hash.update(data));
    fileReadStream.on('end', () => resolve(hash.digest('hex')));
});
const getUploadUrl = () => {
    return b2.getUploadUrl({
        bucketId: process.env.BACKBLAZE_BUCKET_ID
    });
};

const uploadFile = async (file, format, uploaderId) => {
    await b2.authorize();
    const uploadUrl = await getUploadUrl();
    const hashHex = await hashFile(file.buffer);
    return b2.uploadFile({
        uploadUrl: uploadUrl.data.uploadUrl,
        uploadAuthToken: uploadUrl.data.authorizationToken,
        fileName: `${uploaderId}-${hashHex}-${Date.now()}.${format}`,
        mime: file.mimetype,
        data: file.buffer,
    });
};

const downloadFile = async (fileId) => {
  await b2.authorize();
  const { data } = await b2.downloadFileById({
        fileId,
        responseType: 'arraybuffer'
  });
  return data;
};

module.exports = {
    uploadFile,
    downloadFile
};
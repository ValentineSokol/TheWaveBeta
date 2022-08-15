const sharp = require('sharp');
const pornImageFilter = require('./pornFilter/classifyImage');
const FileCloudStore = require('./FileCloudStore');
const { Files } = require('../../models');

const convertToWebp = (buffer) => {
    const settings = { quality: 100, lossless: true };
    return sharp(buffer).webp(settings).toBuffer();
};
const processImageFile = async (buffer) => {
    const steps = [
        pornImageFilter(buffer),
        convertToWebp(buffer)
    ];
    return Promise.all(steps);
};
const createFileRecord = (fileInfo) => {
    return Files.create(fileInfo);
};
const getFileRecord = (id) => {
    return Files.findByPk(id);
};
const uploadFiles = async (files, owner) => {
    const uploads = [];
    const fileInfos = [];
    for (const file of files) {
        let { buffer, mimetype, filename } = file;
        const fileInfo = { owner, name: filename, mimetype };

        let [fileType, fileFormat] = mimetype.split('/');
        if (fileType === 'image') {
            const [isNSFW, webpBuffer] = await processImageFile(buffer);
            fileInfo.nsfw = isNSFW;
            buffer = webpBuffer;
            fileInfo.mimetype = 'image/webp'
            fileFormat = 'webp';
        }
        fileInfos.push(fileInfo);
        const fileUploadPromise = FileCloudStore.uploadFile(file, fileFormat, owner);
        uploads.push(fileUploadPromise);
    }
    const uploadedFiles = await Promise.allSettled(uploads);
    const urlPromises = uploadedFiles.map(async (result, i) => {
        if (!result?.value?.data) return;
        //TODO: in case of any failure, use async queue to upload
        const fileInfo = fileInfos[i];
        fileInfo.fileId = result.value.data.fileId;

        const record = await createFileRecord(fileInfo);
        return `/files/${record.id}`;
    });
    return Promise.all(urlPromises);
}
const downloadFile = async (recordId) => {
    const fileRecord = await getFileRecord(recordId);
    const data = await FileCloudStore.downloadFile(fileRecord.fileId);
    return { ...fileRecord.dataValues, data };
}

module.exports = {
    processImageFile,
    createFileRecord,
    getFileRecord,
    uploadFiles,
    downloadFile
};
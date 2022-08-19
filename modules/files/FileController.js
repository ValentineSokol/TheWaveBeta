const FileModel = require('./FileModel');

const uploadFiles = async (req, res) => {
    const urls = await FileModel.uploadFiles(req.files, req.user);
    res.status(201).json({ success: true, urls });
};

const downloadFile = async (req, res) => {
    const result = await FileModel.downloadFile(req.params.id);
    res.set('Cache-Control', 'private');
    res.set('NSFW-Content', result.nsfw ? true : '');
    res.end(result.data, 'binary');
};

module.exports = { uploadFiles, downloadFile };
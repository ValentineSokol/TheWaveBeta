const { Router } = require('express');
const upload = require('../../middlewares/fileUpload');
const auth = require('../../middlewares/auth');
const { uploadFiles, downloadFile } = require('./FileController');
const router = Router();

router.post('/upload', auth(), upload, uploadFiles);

router.get('/:id', auth(false), downloadFile);

module.exports = router;
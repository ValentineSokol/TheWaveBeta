const multer = require('multer');

const storage = multer.memoryStorage();
module.exports = multer({ storage }).array('files');
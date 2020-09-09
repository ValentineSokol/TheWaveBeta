const crypto = require('crypto');
const streamifier = require('streamifier');
module.exports = (buffer) => new Promise((resolve, reject) => {
    if (!buffer) reject('No Buffer provided!');
    const hash = crypto.createHash('sha3-512');
    const fileReadStream = streamifier.createReadStream(buffer);
    fileReadStream.on('data', data => hash.update(data));
    fileReadStream.on('end', () => resolve(hash.digest('hex')));
});
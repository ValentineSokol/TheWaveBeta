const tf = require('@tensorflow/tfjs-node');
const nsfw = require('nsfwjs');
const sharp = require('sharp');
const nsfwTresholds = require('./nswfDetectionThresholds');

let modal;


async function isImageNSFW(buffer) {
    const predictions = await classifyImage(buffer);
    return compareThresholds(predictions);
}
async function classifyImage(buffer) {
    model = modal ? modal : await nsfw.load();
    const obj = await sharp(buffer)
        .jpeg()
        .toBuffer({ resolveWithObject: true });
    const image = await tf.node.decodeImage(obj.data, 3);
    const predictions = await model.classify(image);
    image.dispose();
    console.log(predictions);
    const result = {};
    for (let obj of predictions) {
        result[obj.className.toLowerCase()] = obj.probability * 100;
    }
    return result;
}

function compareThresholds(predictions) {
    let result = false;
    for (const category in nsfwTresholds) {
      if (predictions[category] < nsfwTresholds[category]) continue;
      result = true;
    }
    return result;
}

module.exports = isImageNSFW;
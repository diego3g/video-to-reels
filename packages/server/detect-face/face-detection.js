const fs = require('fs/promises');
const path = require('path');

const tf = require('@tensorflow/tfjs-node');
const faceapi = require('@vladmandic/face-api/dist/face-api.node.js');

const modelPathRoot = 'models';

let optionsSSDMobileNet;

async function image(file) {
  const decoded = tf.node.decodeImage(file);
  const casted = decoded.toFloat();
  const result = casted.expandDims(0);
  
  decoded.dispose();
  casted.dispose();

  return result;
}

async function detect(tensor) {
  const result = await faceapi.detectAllFaces(tensor, optionsSSDMobileNet);
  return result;
}

async function searchFaceOnFile(file) {
  console.log("FaceAPI single-process test");

  await faceapi.tf.setBackend("tensorflow");
  await faceapi.tf.enableProdMode();
  await faceapi.tf.ENV.set("DEBUG", false);
  await faceapi.tf.ready();

  console.log(
    `Version: TensorFlow/JS ${faceapi.tf?.version_core} FaceAPI ${
      faceapi.version.faceapi
    } Backend: ${faceapi.tf?.getBackend()}`
  );

  console.log("Loading FaceAPI models");
  const modelPath = path.join(__dirname, modelPathRoot);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  
  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.5,
  });

  const tensor = await image(file);
  const result = await detect(tensor);

  console.log("Detected faces:", result.length);

  tensor.dispose();

  return result;
}

async function main() {
  const data = await fs.readFile(path.resolve(__dirname, '../tmp/frame.png'));
  const results = await searchFaceOnFile(data);

  await fs.writeFile(path.resolve(__dirname, '../tmp/face.json'), JSON.stringify(results, null, 2), {
    encoding: 'utf8',
  });
}

main()
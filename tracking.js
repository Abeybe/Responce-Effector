//Face Traking

const inputSize = 512; 
const scoreThreshold = 0.5; 
const options = new faceapi.TinyFaceDetectorOptions({
  inputSize,
  scoreThreshold
});
const video = document.getElementById("js-local-stream");
window.onload=async function(){
    await faceapi.nets.tinyFaceDetector.load("models/");   
}

async function faceTrack(){
  return await faceapi.detectSingleFace(
      video,
      options
  );
}
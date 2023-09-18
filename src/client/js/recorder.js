import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const ffmpeg = new FFmpeg({ log: true });
let loaded = false;

const load = async () => {
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";
  ffmpeg.on("log", ({ message }) => {
    console.log(message);
  });

  await ffmpeg.load({
    coreURL: `${baseURL}/ffmpeg-core.js`,
    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
  });

  loaded = true;
};

const handleDownload = async () => {
  if (!loaded) {
    console.log("FFmpeg is not loaded yet, loading now...");
    await load();
  }

  await ffmpeg.writeFile("recording.webm", await fetchFile(videoFile));
  await ffmpeg.exec(["-i", "recording.webm", "-r", "60", "output.mp4"]);
  //
  await ffmpeg.exec([
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg",
  ]);

  const mp4File = await ffmpeg.readFile("output.mp4");
  const thumbFile = await ffmpeg.readFile("thumbnail.jpg");
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumBlob);
  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click();
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 400, height: 200 },
  });
  video.srcObject = stream;
  video.play();
};

init();
startBtn.addEventListener("click", handleStart);

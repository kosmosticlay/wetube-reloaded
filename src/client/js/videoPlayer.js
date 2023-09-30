const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector(".fa-play");
const backwardBtnIcon = playBtn.querySelector(".fa-backward");
const forwardBtnIcon = playBtn.querySelector(".fa-forward");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoWrap = document.querySelector(".videoContainer__video-screen");
const videoControls = document.querySelector(".videoControls");
const videoCreatedAt = document.querySelector(".video-uploadDate");

let volumeValue = 0.5;
video.volume = volumeValue;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused
    ? "fa-solid fa-play"
    : "fa-solid fa-pause";
};

const handleBackwardClick = () => {
  video.currentTime -= 5;
};

const handleForwardClick = () => {
  video.currentTime += 5;
};

const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
    videoControls.style.width = "90%";
    videoControls.style.height = "10%";
    videoControls.style.padding = "0 15px";
    videoControls.style.fontSize = "15px";
  } else {
    videoWrap.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
    videoControls.style.width = "70%";
    videoControls.style.height = "60px";
    videoControls.style.padding = "0 25px";
    videoControls.style.fontSize = "23px";
  }
};

const handleFullscreenChange = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    fullScreenIcon.classList = "fas fa-compress";
    videoControls.style.width = "70%";
    videoControls.style.height = "60px";
    videoControls.style.padding = "0 25px";
    videoControls.style.fontSize = "23px";
  } else {
    fullScreenIcon.classList = "fas fa-expand";
    videoControls.style.width = "90%";
    videoControls.style.height = "10%";
    videoControls.style.padding = "0 15px";
    videoControls.style.fontSize = "15px";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 2000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 2000);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
  // fetch()는 get 요청을 보내는 것
};

videoCreatedAt.innerText = videoCreatedAt.innerText.substring(0, 18);
video.readyState > 0
  ? handleLoadedMetadata()
  : video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
video.addEventListener("click", handlePlayClick);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
playBtnIcon.addEventListener("click", handlePlayClick);
backwardBtnIcon.addEventListener("click", handleBackwardClick);
forwardBtnIcon.addEventListener("click", handleForwardClick);
muteBtnIcon.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
document.addEventListener("fullscreenchange", handleFullscreenChange);

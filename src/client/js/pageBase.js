const scrollDownArrow = document.querySelector(".scrollDown-arrow");
const videoContentGrid = document.querySelector(".video-grid");

/* smooth scroll */
function smoothScroll(element, target, duration) {
  const startPosition = element.scrollTop;
  const distance = target - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    element.scrollTop = run;
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

window.addEventListener("wheel", function (event) {
  const videoGrid = document.querySelector(".video-grid");
  videoGrid.scrollTop += event.deltaY;
  event.preventDefault();
});
scrollDownArrow.addEventListener("click", function () {
  smoothScroll(videoContentGrid, videoContentGrid.scrollTop + 250, 500);
});

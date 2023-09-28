import { random } from "core-js/es/number";

const titleLetters = document.querySelector(".main-title");
const blinkLetters = titleLetters.querySelectorAll("span");
const headerLoginBtn = document.querySelector(".header-login");
const headerJoinBtn = document.querySelector(".header-join");
const sidebarBtn = document.querySelector(".sideBtn");
const sidebar = document.querySelector(".home-sideBar");
const videoContentGrid = document.querySelector(".video-grid");

const blinkRandomLetter = () => {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * blinkLetters.length);
  } while (randomIndex === 5 || randomIndex === 10);
  blinkLetters.forEach((element, index) => {
    if (index === randomIndex) {
      element.classList.add("blink");
      setTimeout(() => {
        element.classList.remove("blink");
      }, 1200);
    }
  });
};

blinkRandomLetter();
setInterval(blinkRandomLetter, 2000);

const barShow = () => {
  sidebar.classList.toggle("hide");
  sidebarBtn.classList.toggle("flip");
  videoContentGrid.classList.toggle("centered");
  scrollDownArrow.classList.toggle("arrow-centered");
};

if (headerLoginBtn) {
  headerLoginBtn.addEventListener("click", function () {
    window.location.href = "/login";
  });
}
if (headerJoinBtn) {
  headerJoinBtn.addEventListener("click", function () {
    window.location.href = "/join";
  });
}

sidebarBtn.addEventListener("click", barShow);

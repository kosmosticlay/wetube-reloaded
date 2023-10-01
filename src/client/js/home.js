import { random } from "core-js/es/number";

const titleLetters = document.querySelector(".main-title");
const blinkLetters = titleLetters.querySelectorAll("span");
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

sidebarBtn.addEventListener("click", barShow);

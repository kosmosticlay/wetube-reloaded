const loginForm = document.querySelector("#login-form");
const loginBtn = document.querySelector("#login-form__loginBtn");
const bodyWrap = document.querySelector(".bodyWrap");
const slogan = document.querySelector(".website__slogan");
const leftGlass = document.querySelector(".left-glass");
const rightGlass = document.querySelector(".right-glass");
const yellowbubble = document.querySelector(".glassIllust__effect");
const pinkbubble1 = document.querySelector(".pink-bubble1");
const pinkbubble2 = document.querySelector(".pink-bubble2");
const totalWrap = document.querySelector(".totalWrap");
const socialLoginSubmit = document.querySelector(
  ".social__btn.social__btn--github"
);

const handleShowAnimation = () => {
  const title = document.querySelector(".website__title");
  title.style.opacity = "1";
  leftGlass.style.opacity = "1";
  rightGlass.style.opacity = "1";
};

const handleLoginAnimation = (event) => {
  event.preventDefault();
  bodyWrap.classList.add("moveUp");
  setTimeout(handleShowAnimation, 1350);
  setTimeout(() => {
    leftGlass.classList.add("leftGlassToast");
    rightGlass.classList.add("rightGlassToast");
    yellowbubble.style.opacity = "1";
  }, 2700);
  setTimeout(() => {
    slogan.classList.add("showSlogan");
  }, 3500);
  setTimeout(() => {
    setInterval(() => {
      pinkbubble1.classList.add("bubbleUp1");
      setTimeout(() => {
        pinkbubble1.classList.remove("bubbleUp1");
      }, 950);
    }, 1200);
    setInterval(() => {
      pinkbubble2.classList.add("bubbleUp2");
      setTimeout(() => {
        pinkbubble2.classList.remove("bubbleUp2");
      }, 950);
    }, 1200);
  }, 3600);
  setTimeout(() => {
    totalWrap.style.opacity = "0";
  }, 6500);
  bodyWrap.addEventListener("animationend", () => {
    setTimeout(() => {
      loginForm.submit();
    }, 4300);
  });
};

const handleSocialLoginAnimation = (event) => {
  event.preventDefault();
  bodyWrap.classList.add("moveUp");
  setTimeout(handleShowAnimation, 1350);
  setTimeout(() => {
    leftGlass.classList.add("leftGlassToast");
    rightGlass.classList.add("rightGlassToast");
    yellowbubble.style.opacity = "1";
  }, 2700);
  setTimeout(() => {
    slogan.classList.add("showSlogan");
  }, 3500);
  setTimeout(() => {
    setInterval(() => {
      pinkbubble1.classList.add("bubbleUp1");
      setTimeout(() => {
        pinkbubble1.classList.remove("bubbleUp1");
      }, 950);
    }, 1200);
    setInterval(() => {
      pinkbubble2.classList.add("bubbleUp2");
      setTimeout(() => {
        pinkbubble2.classList.remove("bubbleUp2");
      }, 950);
    }, 1200);
  }, 3600);
  setTimeout(() => {
    totalWrap.style.opacity = "0";
  }, 6500);
  bodyWrap.addEventListener("animationend", () => {
    setTimeout(() => {
      window.location.href = "/users/github/start";
    }, 4300);
  });
};

loginBtn.addEventListener("click", handleLoginAnimation);
socialLoginSubmit.addEventListener("click", handleSocialLoginAnimation);

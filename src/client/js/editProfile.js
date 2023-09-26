const editAvatarBtn = document.querySelector(".editProfileBtn");
const avatarInput = document.querySelector("input#avatar");

const editAvatar = (event) => {
  event.preventDefault();
  avatarInput.click();
};

editAvatarBtn.addEventListener("click", editAvatar);

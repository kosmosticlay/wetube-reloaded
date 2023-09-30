const editAvatarBtn = document.querySelector(".editProfileBtn");
const avatarInput = document.querySelector("input#avatar");
let profileFrame = document.querySelector(".profile__frame");
const profileSubstitute = document.querySelector(
  ".no-avatarUrl.profile-avatarUrl"
);

const editAvatar = (event) => {
  event.preventDefault();
  avatarInput.click();
};

/* file input으로 선택한 파일 보이게 하기 */
document.addEventListener("DOMContentLoaded", (event) => {
  avatarInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.match("image.*")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profileFrame = document.querySelector(".profile__frame");
        if (!profileFrame) {
          profileFrame = document.createElement("img");
          profileFrame.classList.add("profile__frame");
          profileSubstitute.remove();
          document
            .querySelector(".edit-profile__main__profile")
            .appendChild(profileFrame);
        }
        profileFrame.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
});

editAvatarBtn.addEventListener("click", editAvatar);

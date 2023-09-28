const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const commentsList = document.querySelector(".video__comments ul");

const addComment = (text, id, commentowner) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";

  const commentOwner = document.createElement("span");
  commentOwner.innerText = `${commentowner}`;
  commentOwner.className = "commentOwner";
  const commentContent = document.createElement("span");
  commentContent.className = "commentContent";
  commentContent.innerText = ` ${text}`;
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fa-solid fa-trash-can deleteComment";
  newComment.appendChild(commentOwner);
  newComment.appendChild(commentContent);
  newComment.appendChild(deleteIcon);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId, userId, userAvatarUrl } = await response.json();
    addComment(text, newCommentId, userId, userAvatarUrl);
  }
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}

const handleCommentRemove = async (event) => {
  console.log("deleting");
  const deleteCommentBtn = event.target;
  const comment = deleteCommentBtn.closest("[data-id]");
  const commentId = comment.dataset.id;
  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  if (response.status === 201) {
    comment.remove();
  }
};

const initCommentArea = () => {
  const commentEach = commentsList.querySelectorAll("li");
  commentEach.forEach((li) => {
    const closeBtn = li.querySelector("i");
    closeBtn.addEventListener("click", handleCommentRemove);
  });
};
initCommentArea();

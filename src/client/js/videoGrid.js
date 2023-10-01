const createdAtList = document.querySelectorAll(".video-mixin__createdAt");

createdAtList.forEach((item) => {
  const createdAtShort = item.innerText.substring(3, 15);
  item.innerText = createdAtShort;
});

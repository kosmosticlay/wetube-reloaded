const createdAtList = document.querySelectorAll(".video-mixin__createdAt");

createdAtList.forEach((item) => {
  const createdAtShort = item.innerText.substring(0, 16);
  item.innerText = createdAtShort;
});

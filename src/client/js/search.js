const searchInput = document.querySelector("#search input");
const searchForm = document.querySelector("#search");
const searchBtn = document.querySelector("button");

searchInput.addEventListener("focus", () => {
  searchForm.style.borderColor = "#37c6da";
  searchBtn.style.color = "#37c6da";
});

searchInput.addEventListener("blur", () => {
  searchForm.style.borderColor = "#888888";
  searchBtn.style.color = "#888888";
});

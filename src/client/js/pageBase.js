const pageSidebar = document.querySelector(".page-sidebar");
const pageSideBarBtn = pageSidebar.querySelector(".fa-bars");

const handleSideBar = () => {
  const sidebarBtnList = pageSidebar.querySelector("ul");
  sidebarBtnList.classList.toggle("hide");
};

pageSideBarBtn.addEventListener("click", handleSideBar);

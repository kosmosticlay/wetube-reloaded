import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  // req.session.loggedIn이 undefined, null등 boolean이 아닐 가능성도 있기 때문
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  // 로그인 되어 있지 않으면 undefined 반환
  next(); // next() 함수가 없으면 웹사이트 작동하지 않는다.
};

/* 로그인하지 않은 사용자의 접근 방지 */
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
    // loggedIn은 유저가 로그인할 때 session에 저장되는 정보
    // 즉, session에 저장되어 있기 때문에 controller/middleware 모두 접근 가능
  } else {
    return res.redirect("/login");
  }
};

/* 로그인하지 않은 사용자들만 접근 가능 */
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const uploadFiles = multer({
  dest: "uploads/",
});

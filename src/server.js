/* server.js에서는 express된 것들과 configuration에 관련된 코드만 포함 */
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");
app.use(logger);

/* pug 설정*/
app.set("view engine", "pug");
/* cwd 경로를 수정 */
app.set("views", process.cwd() + "/src/views");
/* express app이 form 데이터를 처리할 수 있게 설정 */
app.use(express.urlencoded({ extended: true }));

/* express-session 미들웨어를 router 인스턴스를 마운트 하기 전에 초기화 */
/* 아래 session이라는 미들웨어가 브라우저에 cookie를 전송, 백엔드에 request를 
보낼 때마다 브라우저는 자동적으로 cookie를 같이 전송한다.*/
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);
/* 세션 확인을 위한 middleware */
app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    next();
  });
});

/* 생성한 라우터 인스턴스를 애플리케이션에 마운트 */
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

/* init.js에서 app을 사용할 수 있도록 export */
export default app;

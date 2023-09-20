import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/wetube-reloaded", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,/
});

const db = mongoose.connection;

const handleOpen = () => console.log("⭕Connected to DB");
const handleError = (error) => console.log("❌DB error", error);

/* database 연결시 에러가 발생하면 실행될 콜백 함수 */
db.on("error", handleError);
/* database가 정상적으로 연결되면 실행될 콜백 함수 (open = connected) */
db.once("open", handleOpen);

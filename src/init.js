import "dotenv/config";
// 애플리케이션 가장 상단(가장 먼저)에 입력해야 함
/* 초기화 */
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;
// const PORT = 4000;

/* application 작동 */
const handleListening = () =>
  console.log(`⭕Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);

import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, uppercase: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, required: true, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

videoSchema.static("formatHashtags", function () {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

/* (Video.create()에 대한 pre-middleware) 
   model이 생성되기 전에 pre Middleware save 이벤트에 적용 */
// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((word) => (word.startsWith("#") ? word : `#${word}`));
// });
/* videoSchema에서 hashtags를 string으로 입력시 자동으로 array로 변환시키도록
설정하였기 때문에 input에 입력된 값이 array의 첫번째 element로 저장된다 */

/* model을 compile */
const Video = mongoose.model("Video", videoSchema);
export default Video;

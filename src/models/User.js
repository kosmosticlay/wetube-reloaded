import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  location: String,
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});
// this는 생성된 User을 의미 / 5는 '해싱되는 횟수'를 의미
// pre-middleware는 model이 생성되기 전에 실행

const User = mongoose.model("User", userSchema);
export default User;

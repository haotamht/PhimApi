import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  displayname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  history: [],
  likedvideo: [],
  role: { type: String, required: true, default: "normal" },
  search: [],
});
var User = mongoose.model("User", UserSchema, "User");
export default User;

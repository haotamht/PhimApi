import express from "express";
import {
  register,
  login,
  view,
  getHistoryView,
  search,
  getSearch,
  like,
  getLiked,
  getInfo,
} from "../Controller/UserController.js";

import { ValidateUsername } from "../Middleware/validateUsername.js";
import { ValidatePass } from "../Middleware/validatePasswords.js";
import { verifyToken } from "../Middleware/veryfiToken.js";

const userRoute = express.Router();

userRoute.post("/register", ValidateUsername, ValidatePass, register);
userRoute.post("/login", ValidateUsername, ValidatePass, login);
userRoute.post("/view", verifyToken, view);
userRoute.get("/view", verifyToken, getHistoryView);
userRoute.post("/search", verifyToken, search);
userRoute.get("/search", verifyToken, getSearch);
userRoute.post("/like", verifyToken, like);
userRoute.get("/like", verifyToken, getLiked);
userRoute.get("/info", verifyToken, getInfo);

export default userRoute;

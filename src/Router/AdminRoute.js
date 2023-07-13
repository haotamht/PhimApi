import express from "express";
import {
  addFilm,
  loginAdmin,
  addEpisodeFilm,
  registerAdmin,
  countAdmin,
  getAllUser,
  getAllFilm,
  deleteFilm,
  deleteUser,
  getFilm,
  deleteEpisode,
} from "../Controller/AdminController.js";

import { ValidatePass } from "../Middleware/validatePasswords.js";
import { verifyTokenAdmin } from "../Middleware/veryfiToken.js";
import handler from "../Middleware/uploads.js";

const adminRoute = express.Router();

adminRoute.post("/login", ValidatePass, loginAdmin);
adminRoute.post("/register", registerAdmin);
adminRoute.post("/count", countAdmin);
adminRoute.get("/listuser", verifyTokenAdmin, getAllUser);
adminRoute.get("/listfilm", verifyTokenAdmin, getAllFilm);
adminRoute.post("/film", verifyTokenAdmin, addFilm);
adminRoute.get("/film/:id", verifyTokenAdmin, getFilm);
adminRoute.post("/delete/film", verifyTokenAdmin, deleteFilm);
adminRoute.post("/delete/episode", verifyTokenAdmin, deleteEpisode);
adminRoute.post("/delete/user", verifyTokenAdmin, deleteUser);
adminRoute.post("/episode", verifyTokenAdmin, addEpisodeFilm);

export default adminRoute;

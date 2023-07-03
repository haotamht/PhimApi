import express from "express";
import { getAll, streamVideos, getFilm } from "../Controller/FilmController.js";

const fimlRoute = express.Router();
fimlRoute.get("/", getAll);
fimlRoute.get("/:id", getFilm);
fimlRoute.get("/episode/:pathPhim", streamVideos);
export default fimlRoute;

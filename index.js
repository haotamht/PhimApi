import * as dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import userRoute from "./src/Router/UserRoute.js";
import fimlRoute from "./src/Router/FilmRoute.js";
import adminRoute from "./src/Router/AdminRoute.js";

dotenv.config();
try {
  (async () => {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("ok");
  })();
} catch (e) {
  console.log(e);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDirectory = "public";

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json({ limit: "300mb" }));
app.use(bodyParser.urlencoded({ limit: "300mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(uploadDirectory));

app.use("/api/user", userRoute);
app.use("/api/film", fimlRoute);
app.use("/api/admin", adminRoute);

app.get("/image/:name", async (req, res) => {
  let name = req.params.name;
  res.sendFile(join(__dirname, `/public/images/${name}`));
});
app.use("/image", express.static(`${__dirname}/Image`));

app.listen(process.env.PORT, () => {
  console.log(`Sever listen on port ${process.env.PORT}`);
});

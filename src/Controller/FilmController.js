import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import RangeParser from "range-parser";
import Resize from "../Controller/Resize.js";
import FilmModel from "../models/FilmModel.js";
import ffmpeg from "ffmpeg";

export const getAll = async (req, res) => {
  try {
    let data = await FilmModel.find({});
    res.json({ status: true, data: data });
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err });
  }
};

export const getFilm = async (req, res) => {
  try {
    const id = req.params.id;

    let data = await FilmModel.find({ _id: id });
    res.json({ status: true, data: data[0] });
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err });
  }
};
const decompressVideo = async (path, pathNew) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(path)
      .output(pathNew)
      .on("end", () => {
        console.log("Giải nén video hoàn thành!");
        resolve();
      })
      .on("error", (err) => {
        console.error("Lỗi khi giải nén video:", err);
        reject(err);
      })
      .run();
  });
};

export const streamVideos = async (req, res) => {
  try {
    const { pathPhim } = req.params; // Hoặc req.query tùy thuộc vào cách bạn truyền thông tin
    //const { tenPhim } = await FilmModel.findOne({ _id: id });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const controllerDir = path.resolve(__dirname, "../public");
    const videosDir = path.join(controllerDir, "videos");
    const filmPath = path.join(videosDir, `${pathPhim}`);
    const pathDecompressVideo = `public/videos/${uuidv4()}.mp4`;
    const videoStream = decompressVideo(filmPath, pathDecompressVideo);

    const canonicalPath = path.resolve(videoStream.output);

    if (!canonicalPath) {
      return res.status(404).send("File not found");
    }

    const stat = fs.statSync(canonicalPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(canonicalPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);

      file.on("end", () => {
        fs.unlink(videoStream.output, (err) => {
          if (err) {
            console.error("Lỗi khi xóa video giải nén:", err);
          } else {
            console.log("Xóa video giải nén thành công!");
          }
        });
      });
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(canonicalPath).pipe(res);
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

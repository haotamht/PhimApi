import multer from "multer";
import path from "path";

// Cấu hình Multer cho ảnh
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/"); // Thư mục lưu trữ ảnh
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const isImage = [".png", ".jpg", ".jpeg"].includes(
      fileExtension.toLowerCase()
    );

    if (isImage) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "image-" + uniqueSuffix + "." + fileExtension);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// Cấu hình Multer cho video
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/videos/"); // Thư mục lưu trữ video
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const isVideo = [".mp4"].includes(fileExtension.toLowerCase());

    if (isVideo) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "video-" + uniqueSuffix + "." + fileExtension);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// Middleware tải lên ảnh
export const uploadImage = multer({ storage: imageStorage });

// Middleware tải lên video
const uploadVideo = multer({ storage: videoStorage });

// Sử dụng middleware trong route handler
export default function handler(req, res, next) {
  // Tải lên ảnh
  try {
    uploadImage.single("image")(req, res, (err) => {
      if (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Upload Error" });
      } else {
        // Lấy đường dẫn file ảnh từ req.file.path
        if (req.file) {
          const imagePath = req.file.path;
          console.log("Image path:", imagePath);
          req.imagePath = imagePath;
        }

        // Tiếp tục xử lý hoặc chuyển đến tải lên video
        uploadVideo.single("video")(req, res, (err) => {
          if (err) {
            console.error("Upload Error:", err);
            res.status(500).json({ error: "Upload Error" });
          } else {
            // Lấy đường dẫn file video từ req.file.path
            if (req.file) {
              const videoPath = req.file.path;
              req.videoPath = videoPath;
              console.log("Video path:", videoPath);
            }
            next();
          }
        });
      }
    });
  } catch (error) {
    console.log("Error:", error.message);
  }
}

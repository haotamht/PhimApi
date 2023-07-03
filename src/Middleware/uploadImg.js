import multer from "multer";
import path from "path";

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
      cb(null, "image-" + uniqueSuffix + fileExtension);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export const uploadImage = multer({ storage: imageStorage }).single("image");

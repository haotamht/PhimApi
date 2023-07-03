export const uploadFilm = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("Không tìm thấy file.");
  }

  const file = req.files.file;
  const extension = path.extname(file.name);
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".mp4"];

  // Kiểm tra phần mở rộng của file có hợp lệ không
  if (!allowedExtensions.includes(extension)) {
    return res.status(400).send("Phần mở rộng của file không hợp lệ.");
  }

  let uploadPath;
  if (allowedExtensions.includes(".mp4")) {
    uploadPath = path.join(__dirname, uploadDirectory, "videos", file.name);
  } else {
    uploadPath = path.join(__dirname, uploadDirectory, "images", file.name);
  }

  // Lưu file vào server
  file.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send("File đã được tải lên thành công.");
  });
};

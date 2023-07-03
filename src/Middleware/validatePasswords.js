function isPasswordValid(password) {
  // Kiểm tra xem mật khẩu có chứa khoảng trắng hay không
  if (password.includes(" ")) {
    return false;
  }

  // Kiểm tra độ dài tối thiểu là 6
  if (password.length < 6) {
    return false;
  }

  // Kiểm tra các quy tắc khác cho mật khẩu (ký tự đặc biệt, hoa/thường, v.v.)

  // Trả về true nếu mật khẩu hợp lệ
  return true;
}

export const ValidatePass = (req, res, next) => {
  try {
    const { password } = req.body;
    if (!isPasswordValid(password)) {
      res.status(401).json({
        status: 0,
        message: "Mật khẩu phải từ 6 kí tự và không có khoảng trắng",
      });
    } else {
      next();
    }

    // Nếu email hợp lệ, chuyển tiếp request đến middleware tiếp theo
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 0, message: "Fail" });
  }
};

import validator from "validator";

export const ValidateUsername = (req, res, next) => {
  try {
    const { username } = req.body;

    if (
      validator.isEmail(username) ||
      validator.isMobilePhone(username, "vi-VN")
    ) {
      next();
    } else {
      console.log(validator.isEmail(username));

      res
        .status(401)
        .json({ status: 0, message: "Không đúng định dạng email" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 0, message: "Fail" });
  }
};

import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export function verifyToken(req, res, next) {
  const tokenBear = req.headers.authorization;
  const tokenSplit = tokenBear.split("Bearer ");
  const token = tokenSplit[1];
  if (!token) {
    return res.status(401).send({ message: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.dataUser = decoded;
    next();
  } catch (err) {
    res.status(403).send({ message: "Invalid token" });
  }
}

export function verifyTokenAdmin(req, res, next) {
  const token = req.headers.authorization;
  console.log("hihi");
  if (!token) {
    return res.status(401).send({ message: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN_ADMIN);
    req.dataUser = decoded;
    next();
  } catch (err) {
    res.status(403).send({ message: "Invalid token" });
  }
}

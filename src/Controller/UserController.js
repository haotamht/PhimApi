import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";
import md5 from "md5";
import User from "../models/UserModel.js";
import Film from "../models/FilmModel.js";

export async function register(req, res) {
  try {
    const { username, password, displayname } = req.body;
    const data = await User.find({ username });
    if (data?.length > 0) {
      res.json({ status: false, message: "Tài khoản đã tồn tại" });
    } else {
      const newUser = new User({
        displayname: displayname,
        username: username.toLowerCase(),
        password: md5(password),
      });
      await newUser.save();
      res.json({ status: true, message: `Create ${username} done` });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err.message });
  }
}
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    const data = await User.findOne({
      username: username.toLowerCase(),
      password: md5(password),
    });
    if (data) {
      const payload = data.toObject();
      const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN);
      res.json({ status: true, token: token });
    } else {
      res.json({
        status: false,
        message: "Tài Khoản Hoặc Mật Khẩu Không Chính Xác",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err });
  }
}

export async function view(req, res) {
  try {
    const data = req.dataUser;
    if (data) {
      let { id } = req.body;
      console.log(id);
      let timespan = Date.now();
      let datafilm = await FilmModel.findOne({ _id: id });
      //update view
      datafilm.view++;
      await FilmModel.findOneAndUpdate(
        { _id: id },
        { $set: { view: datafilm.view } }
      );
      //push id to history
      let dataUser = await UserModel.findOne({ username: data.username });
      if (dataUser.toObject().history.length == 0) {
        await UserModel.findOneAndUpdate(
          { username: data.username },
          { $push: { history: { id: id, timespan: timespan } } }
        );
      } else {
        let isExit = false;
        let index = 0;
        for (let i = 0; i < dataUser.toObject().history.length; i++) {
          if (dataUser.toObject().history[i].id == id) {
            isExit = true;
            index = i;
          }
        }
        if (isExit) {
          let newArr = [];
          for (let j = 0; j < dataUser.toObject().history.length; j++) {
            if (j == index) {
              let mm = dataUser.toObject().history[j];
              mm.timespan = timespan;
              newArr.push(mm);
            } else {
              let mm = dataUser.toObject().history[j];
              newArr.push(mm);
            }
          }
          newArr.sort((item1, item2) => {
            if (item1.timespan < item2.timespan) {
              return -1;
            }
            if (item1.timespan > item2.timespan) {
              return 1;
            }
            return 0;
          });
          await UserModel.findOneAndUpdate(
            { username: data.username },
            { $set: { history: newArr } }
          );
        } else {
          await UserModel.findOneAndUpdate(
            { username: data.username },
            { $push: { history: { id: id, timespan: timespan } } }
          );
        }
      }

      res.json({ status: true });
    } else {
      res.json({ status: false, message: "Bạn cần đăng nhập để xem" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err });
  }
}
function getFilm(id) {
  return FilmModel.findOne({ _id: id });
}
export async function getHistoryView(req, res) {
  try {
    const data = req.dataUser;
    if (data) {
      let dataUser = await UserModel.findOne({ username: data.username });
      console.log(dataUser.toObject().history);
      let result = [];
      for (let i = 0; i < dataUser.toObject().history.length; i++) {
        await getFilm(dataUser.toObject().history[i].id).then((data) => {
          let res = {
            timespan: dataUser.toObject().history[i].timespan,
            film: data,
          };
          result.push(res);
        });
      }
      res.json({ status: true, data: result.reverse() });
    } else {
      res.json({ status: false, message: "JWT sai" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err });
  }
}
export async function getInfo(req, res) {
  try {
    const data = req.dataUser;
    if (data) {
      res.json({ status: true, message: data });
    } else {
      res.json({ status: false, message: "JWT sai" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err });
  }
}
export async function search(req, res) {
  try {
    const data = req.dataUser;
    if (data) {
      let { search } = req.body;
      if (search.length > 0) {
        await UserModel.findOneAndUpdate(
          { username: data.username },
          { $addToSet: { search: search } }
        );
        let datasearch = await FilmModel.find({});
        let result = datasearch.filter((item) => {
          if (item.name.toLowerCase().indexOf(search.toLowerCase()) != -1)
            return item;
        });
        res.json({ status: true, data: result });
      } else {
        res.json({ status: false, message: "Không được để trống" });
      }
    } else {
      res.json({ status: false, message: "JWT sai" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err });
  }
}
export async function getSearch(req, res) {
  try {
    const data = req.dataUser;
    if (data) {
      let dataUser = await UserModel.findOne({ username: data.username });
      res.json({ status: true, data: dataUser.toObject().search.reverse() });
    } else {
      res.json({ status: false, message: "JWT sai" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err });
  }
}
export async function like(req, res) {
  try {
    const data = req.dataUser;
    if (data) {
      let { id } = req.body;
      let timespan = Date.now();
      console.log(timespan);
      let dataUser = await UserModel.findOne({ username: data.username });
      if (dataUser.toObject().likedvideo == 0) {
        await UserModel.findOneAndUpdate(
          { username: data.username },
          { $push: { likedvideo: { id: id, timespan: timespan } } }
        );
      } else {
        let isExit = false;
        let index = 0;
        for (let i = 0; i < dataUser.toObject().likedvideo.length; i++) {
          if (dataUser.toObject().likedvideo[i].id == id) {
            isExit = true;
            index = i;
          }
        }
        if (isExit) {
          let newArr = [];
          for (let j = 0; j < dataUser.toObject().likedvideo.length; j++) {
            if (j == index) {
              let mm = dataUser.toObject().likedvideo[j];
              mm.timespan = timespan;
              newArr.push(mm);
            } else {
              let mm = dataUser.toObject().likedvideo[j];
              newArr.push(mm);
            }
          }
          newArr.sort((item1, item2) => {
            if (item1.timespan < item2.timespan) {
              return -1;
            }
            if (item1.timespan > item2.timespan) {
              return 1;
            }
            return 0;
          });
          await UserModel.findOneAndUpdate(
            { username: data.username },
            { $set: { likedvideo: newArr } }
          );
        } else {
          await UserModel.findOneAndUpdate(
            { username: data.username },
            { $push: { likedvideo: { id: id, timespan: timespan } } }
          );
        }
      }

      res.json({ status: true });
    } else {
      res.json({ status: false, message: "Bạn cần đăng nhập để xem" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err });
  }
}
export async function getLiked(req, res) {
  try {
    const data = req.dataUser;
    if (data) {
      let dataUser = await UserModel.findOne({ username: data.username });
      let result = [];
      for (let i = 0; i < dataUser.toObject().likedvideo.length; i++) {
        await getFilm(dataUser.toObject().likedvideo[i].id).then((data) => {
          let res = {
            film: data,
            timespan: dataUser.toObject().likedvideo[i].timespan,
          };
          result.push(res);
        });
      }
      res.json({ status: true, data: result.reverse() });
    } else {
      res.json({ status: false, message: "JWT sai" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: err });
  }
}

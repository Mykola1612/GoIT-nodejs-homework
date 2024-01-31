const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const UserMG = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserMG.findOne({ email });

  if (user !== null) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await UserMG.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserMG.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const subscription = user.subscription;

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await UserMG.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email,
      subscription,
    },
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await UserMG.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "No Content",
  });
};

const getCurrent = (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const subscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  console.log(subscription);
  if (
    subscription !== "starter" &&
    subscription !== "pro" &&
    subscription !== "business"
  ) {
    throw HttpError(
      400,
      "The subscription field can only have the following values: starter, pro, business."
    );
  }

  const result = await UserMG.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );
  res.json({ result });
};

const newAvatars = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const image = await Jimp.read(tempUpload);
  await image.resize(250, 250);

  const fileName = `${_id}_${originalname}`;
  const resultUpdateAvatar = path.join(avatarDir, fileName);

  await image.writeAsync(resultUpdateAvatar);
  await fs.unlink(tempUpload);

  const avatarURL = path.join("avatars", fileName);
  await UserMG.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  subscription: ctrlWrapper(subscription),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  newAvatars: ctrlWrapper(newAvatars),
};

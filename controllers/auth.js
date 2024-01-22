const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserMG = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserMG.findOne({ email });

  if (user !== null) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserMG.create({ ...req.body, password: hashPassword });

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

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await UserMG.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
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

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  subscription: ctrlWrapper(subscription),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
};

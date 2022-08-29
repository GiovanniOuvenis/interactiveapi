const { User } = require("../models/User");
const CustomError = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const {
  attachCookieToResponse,
  createJWT,
} = require("../utils/attachCookieToResponse");
const createTokenUser = require("../utils/createTokenUser");

const uploadImage = async (req, res) => {
  console.log(req.files);
  res.status(StatusCodes.OK).json({ msg: "ok uploaded" });
};

const register = async (req, res) => {
  const { username, password } = req.body;

  const isSubscribed = await User.findOne({ username });

  if (isSubscribed) {
    throw new CustomError.BadRequestError("Username already exists");
  }

  const newUser = await User.create({ username, password });
  const tokenUser = createTokenUser(newUser);
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser.username });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomError.BadRequestError(
      "Please provide username and password"
    );
  }

  const userTryingToLog = await User.findOne({ username });

  if (!userTryingToLog) {
    throw new CustomError.UnauthenticatedError(
      "Username does not exist. You have to register or provide valid username "
    );
  }
  const isPasswordCorrect = await userTryingToLog.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(userTryingToLog);
  attachCookieToResponse({ res, user: tokenUser });
  console.log(req);
  res.status(StatusCodes.OK).json({ login: true, username });
};

const logout = async (rq, res) => {
  console.log("logout");
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = { register, login, logout, uploadImage };

const { User } = require("../models/User");
const CustomError = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const allowed = require("../config/allowedOrigins");
const {
  attachCookieToResponse,
  createJWT,
} = require("../utils/attachCookieToResponse");
const createTokenUser = require("../utils/createTokenUser");

const register = async (req, res) => {
  const { username, password } = req.body;
  const image = { png: "temporarystringplaceholder" };
  const isSubscribed = await User.findOne({ username });

  if (isSubscribed) {
    throw new CustomError.BadRequestError("Username already exists");
  }

  const newUser = await User.create({
    username,
    password,
    image,
  });
  const tokenUser = createTokenUser(newUser);
  attachCookieToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ username: tokenUser.username });
};

const uploadFoto = async (req, res) => {
  const { username } = req.body;

  if (!req.files) {
    throw new CustomError.BadRequestError("Please attach image");
  }
  const userImage = req.files.image;

  const fileExtension = userImage.name.slice(
    userImage.name.length - 4,
    userImage.name.length
  );
  const acceptableForms = [".png", ".jpg", "jpeg"];

  if (!acceptableForms.includes(fileExtension)) {
    throw new CustomError.BadRequestError("Please attach image file");
  }
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "interactiveComments",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  const userRegistering = await User.findOne({ username });
  userRegistering.image.png = result.secure_url;
  await userRegistering.save();

  res.status(StatusCodes.CREATED).json({ pic: result.secure_url });
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
  const accessToken = jwt.sign({ payload: tokenUser }, process.env.JWT_SECRET, {
    expiresIn: "10s",
  });
  const refreshToken = jwt.sign(
    { payload: tokenUser },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  /* const accessToken = jwt.sign(
    {
      payload: tokenUser,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );*/
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res
    .status(StatusCodes.OK)
    .json({ username, image: tokenUser.image, accessToken });
};

const logout = async (rq, res) => {
  console.log("logout");
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = { register, login, logout, uploadFoto };

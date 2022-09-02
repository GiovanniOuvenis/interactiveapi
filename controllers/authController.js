const { User } = require("../models/User");
const CustomError = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const {
  attachCookieToResponse,
  createJWT,
} = require("../utils/attachCookieToResponse");
const createTokenUser = require("../utils/createTokenUser");

/*const uploadUserImage = async (req, res) => {
  const userImage = req.files.image;
  const fileExtension = userImage.name.slice(
    userImage.name.length - 4,
    userImage.name.length
  );
  const acceptableForms = [".png", ".jpg", "jpeg"];
  console.log(fileExtension);
  if (!acceptableForms.includes(fileExtension)) {
    throw new CustomError.BadRequestError("Please attach image file");
  }

  const maxSize = 1024 * 1024;
  if (userImage.size > maxSize) {
    throw new CustomError.BadRequestError("Please attach image smaller than");
  }
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "interactiveComments",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};*/

const register = async (req, res) => {
  console.log(req.files);
  const { username, password } = req.body;

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

  const isSubscribed = await User.findOne({ username });

  if (isSubscribed) {
    throw new CustomError.BadRequestError("Username already exists");
  }

  const newUser = await User.create({
    username,
    password,
    image: { png: result.secure_url },
  });
  const tokenUser = createTokenUser(newUser);
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
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
  res
    .status(StatusCodes.OK)
    .json({ login: true, username, image: tokenUser.image });
};

const logout = async (rq, res) => {
  console.log("logout");
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = { register, login, logout };

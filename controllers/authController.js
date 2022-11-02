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
const { CLIENT_RENEG_WINDOW } = require("tls");

const register = async (req, res) => {
  const { username, password } = req.body;
  const tempString = "temporarystringplaceholder";
  const image = { png: tempString };

  const isSubscribed = await User.findOne({ username });

  if (isSubscribed) {
    throw new CustomError.BadRequestError("Username already exists");
  }

  const newUser = await User.create({
    username,
    password,
    image,
    refreshToken: tempString,
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
  const userRegistering = await User.findOne({ username });

  const splitted = result.secure_url.split("/");
  const nameOfFile = splitted[splitted.length - 1];
  const transformedImage = cloudinary.url(`interactiveComments/${nameOfFile}`, {
    height: 50,
    radius: "max",
    width: 50,
    crop: "thumb",
    gravity: "face",
  });

  userRegistering.image.png = transformedImage;

  fs.unlinkSync(req.files.image.tempFilePath);
  await userRegistering.save();

  res.status(StatusCodes.CREATED).json({ pic: transformedImage });
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
    throw new CustomError.UnauthenticatedError("Invalid Username");
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
    { expiresIn: "1d" }
  );

  userTryingToLog.refreshToken = refreshToken;
  const result = await userTryingToLog.save();

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

const refreshTokenController = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    throw new CustomError.UnauthenticatedError("no cookie");

    // res.status(StatusCodes.FORBIDDEN).json("No cookie");
  }
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to perform this action"
    );
  }
  const un = foundUser.username;
  const pic = foundUser.image.png;
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.payload.username) {
      console.log(decoded.payload.username);
      throw new CustomError.UnauthorizedError("Not authorized");
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "10s" }
    );
    res.json({ accessToken, un, pic });
  });

  res.status(StatusCodes.OK);
};

module.exports = {
  register,
  login,
  logout,
  uploadFoto,
  refreshTokenController,
};

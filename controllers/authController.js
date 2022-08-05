const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  attachCookieToResponse,
  createJWT,
} = require("../utils/attachCookieToResponse");
const createTokenUser = require("../utils/createTokenUser");

const register = async (req, res) => {
  const { username, password } = req.body;

  const isSubscribed = await User.findOne({ username });

  if (isSubscribed) {
    throw new CustomError.BadRequestError("Username already exists");
  }

  const newUser = await User.create({ username, password });
  const tokenUser = createTokenUser(newUser);
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomError.BadRequestError(
      "PLease provide username and password"
    );
  }

  const userTryingToLog = User.findOne({ username });

  if (!userTryingToLog) {
    throw new CustomError.UnauthenticatedError(
      "Username does not exist. You have to register or provide valid username "
    );
  }
  const tokenUser = createTokenUser(userTryingToLog);
  attachCookiesToResponse({ res, user: userTryingToLog });
  console.log(req.body.password);
  console.log(userTryingToLog);

  res.status(StatusCodes.OK).json({ user: userTryingToLog });
};

module.exports = { register, login };

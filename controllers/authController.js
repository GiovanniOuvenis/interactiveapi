const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { username, password } = req.body;

  const isSubscribed = await User.findOne({ username });

  if (isSubscribed) {
    throw new CustomError.BadRequestError("Username already exists");
  }

  const newUser = await User.create({ username, password });
  res.status(StatusCodes.CREATED).json({user : newUser})
};

module.exports = register;

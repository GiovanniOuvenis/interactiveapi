const User = require("../models/User");
const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");

const createComment = async (req, res) => {
  const { content, username } = req.body;

  res.send("setup is ok");
};

module.exports = { createComment };

const User = require("../models/User");
const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");

const createComment = async (req, res) => {
  const { content, username } = req.body;
  const initialScore = 0;

  const newComment = await Comment.create({
    username,
    content,
    score: initialScore,
  });
  res.status(StatusCodes.CREATED).json({ comment: newComment });
};

const deleteComment = async (req, res, next) => {
  const { _id, username } = req.body;
  const foundComment = await Comment.findByIdAndDelete({ _id });

  res.status(StatusCodes.OK).json({ msg: "comment succsefully deleted " });
};

module.exports = { createComment, deleteComment };

const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/User");
const CustomError = require("../errors");

const createComment = async (req, res) => {
  const { content, username } = req.body;
  const initialScore = 0;
  const initialReplies = [];
  const who = await User.findOne({ username });

  const newComment = await Comment.create({
    content,
    score: initialScore,
    user: who,
    replies: initialReplies,
  });
  res.status(StatusCodes.CREATED).json({ comment: newComment });
};

const getAllComments = async (req, res) => {
  const allComments = await Comment.find({});

  res.status(StatusCodes.OK).json({ comments: allComments });
};

const getSingleComment = async (req, res) => {
  console.log(req.params);
  res.send("comment found");
};

const deleteComment = async (req, res, next) => {
  const { id } = req.params;
  const { username } = req.body;
  const foundComment = await Comment.findOne({ _id: id });
  const commentAuthor = foundComment.user[0].username;

  if (commentAuthor != username) {
    throw new CustomError.UnauthorizedError("ACTION NOT PERMITTED");
  }

  await Comment.findOneAndDelete({ _id: id });

  res.status(StatusCodes.OK).json({ msg: "comment succsefully deleted " });
};

module.exports = {
  createComment,
  deleteComment,
  getAllComments,
  getSingleComment,
};

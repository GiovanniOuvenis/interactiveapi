const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/User");
const CustomError = require("../errors");

const createComment = async (req, res) => {
  console.log(req.username, "username..??");
  const { username: requestUsername } = req;
  const { content } = req.body;
  const { username, _id } = await User.findOne({ requestUsername });
  const newComment = await Comment.create({
    content,
    score: 0,
    user: { username, _id },
    replies: [],
  });
  res.status(StatusCodes.CREATED).json({ comment: newComment });
};

const getAllComments = async (req, res) => {
  const result = await Comment.aggregate([
    {
      $sort: {
        score: -1,
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ comments: result });
};

const changeScore = async (req, res) => {
  const { id } = req.params;
  const { increase } = req.body;
  const currentComment = await Comment.findOne({ _id: id });
  if (increase === "true") {
    currentComment.score++;
  } else {
    currentComment.score--;
  }
  await currentComment.save();
  res.status(StatusCodes.OK).json({ score: currentComment.score });
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

const replyToComment = async (req, res) => {
  const { id } = req.params;
  const { content, username } = req.body;
  const commentToReply = await Comment.findOne({ _id: id });
  const whoReplies = await User.findOne({ username });
  const replyScore = 0;
  const replyReplies = [];

  const replyDocument = await Comment.create({
    content: content,
    score: replyScore,
    user: whoReplies,
    replies: replyReplies,
  });

  await commentToReply.replies.push(replyDocument);
  await commentToReply.save();

  res.status(StatusCodes.CREATED).json({ commentWithReplies: commentToReply });
};
module.exports = {
  createComment,
  deleteComment,
  getAllComments,
  changeScore,
  replyToComment,
};

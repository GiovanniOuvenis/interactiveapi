const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/User");
const CustomError = require("../errors");

const createComment = async (req, res) => {
  const { username, content } = req.body;
  const whoCommented = await User.findOne({ username });
  const newComment = await Comment.create({
    content,
    score: 0,
    authorName: username,
    authorPicture: whoCommented.image.png,
    replies: [],
    upVotesBy: [],
    downVotesBy: [],
    isReply: false,
  });
  res.status(StatusCodes.CREATED).json({ comment: true });
};

const getAllComments = async (req, res) => {
  const result = await Comment.aggregate([
    [
      {
        $match: {
          isReply: false,
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
    ],
  ]);

  res.status(StatusCodes.OK).json({ comments: result });
};

const vote = async (req, res) => {
  const { username, id, type } = req.body;
  const currentComment = await Comment.findOne({ _id: id });
  const upVoted = currentComment.upVotesBy.includes(username);
  const downVoted = currentComment.downVotesBy.includes(username);

  if (type === "plus" && upVoted) {
    currentComment.score--;
    const newVoters = currentComment.upVotesBy.filter((un) => {
      return un != username;
    });
    currentComment.upVotesBy = newVoters;
  }
  if (type === "plus" && !upVoted) {
    currentComment.score++;
    currentComment.upVotesBy.push(username);
  }
  if (type === "minus" && downVoted) {
    currentComment.score++;
    const newVoters = currentComment.upVotesBy.filter((un) => {
      return un != username;
    });
    currentComment.downVotesBy = newVoters;
  }
  if (type === "minus" && !downVoted) {
    currentComment.score--;
    currentComment.downVotesBy.push(username);
  }

  /* if (voted) {
    currentComment.score--;
    currentComment.whoVoted.push(username);
  }
  if (!condition && !increase) {
    currentComment.score--;
    currentComment.whoVoted.push(username);
  }*/
  await currentComment.save();

  res.status(StatusCodes.OK).json({ score: currentComment.score });
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  await Comment.findOneAndDelete({ _id: id });
  res.status(StatusCodes.OK).json({ msg: "comment succsefully deleted " });
};

const replyToComment = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  const { content, username } = req.body;
  const commentToReply = await Comment.findOne({ _id: id });
  const whoReplies = await User.findOne({ username });
  const replyScore = 0;
  const replyReplies = [];
  const votesFrom = [];

  const replyDocument = await Comment.create({
    content: content,
    score: replyScore,
    authorName: whoReplies.username,
    authorPicture: whoReplies.image.png,
    isReply: true,
    replies: replyReplies,
    upVotesBy: [],
    downVotesBy: [],
  });

  commentToReply.replies.push(replyDocument);
  await commentToReply.save();

  res.status(StatusCodes.CREATED).json({ commentWithReplies: commentToReply });
};
module.exports = {
  createComment,
  deleteComment,
  getAllComments,
  vote,
  replyToComment,
};

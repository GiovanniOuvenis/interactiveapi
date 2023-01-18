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
    repliesTo: "",
    level: 0,
  });

  await newComment.save();
  res.status(StatusCodes.CREATED).json({ comment: true });
};

const getAllComments = async (req, res) => {
  const result = await Comment.aggregate([
    {
      $sort: {
        level: -1,
      },
    },
  ]);
  const structureComments = async (commentsArray) => {
    let auxiliaryObject = {};

    for (const comment of commentsArray) {
      const {
        _id,
        content,
        score,
        authorName,
        replies,
        authorPicture,
        createdAt,
      } = comment;

      const timeInMiliseconds = createdAt.valueOf();
      auxiliaryObject[comment._id] = {
        _id,
        content,
        score,
        authorName,
        authorPicture,
        timeInMiliseconds,
        replies,
      };

      if (auxiliaryObject[comment._id].replies.length > 0) {
        for (let i = 0; i < auxiliaryObject[comment._id].replies.length; i++) {
          const stringForm = auxiliaryObject[comment._id].replies[i].toString();
          auxiliaryObject[comment._id].replies[i] = auxiliaryObject[stringForm];
          delete auxiliaryObject[stringForm];
        }
      }
    }
    let arrayToReturn = Object.keys(auxiliaryObject).map((id) => {
      return auxiliaryObject[id];
    });
    return arrayToReturn.sort(function (itemOne, itemTwo) {
      return itemTwo.score - itemOne.score;
    });
  };

  const execute = await structureComments(result);
  res.status(StatusCodes.OK).json(execute);
};

const vote = async (req, res) => {
  const { username, id, type } = req.body;
  const currentComment = await Comment.findOne({ _id: id });
  const upVoted = currentComment.upVotesBy.includes(username);
  const downVoted = currentComment.downVotesBy.includes(username);

  if (upVoted) {
    currentComment.score--;
    currentComment.upVotesBy = currentComment.upVotesBy.filter((upVoter) => {
      return upVoter !== username;
    });
  }

  if (downVoted) {
    currentComment.score++;
    currentComment.downVotesBy = currentComment.downVotesBy.filter(
      (downVoter) => {
        return downVoter !== username;
      }
    );
  }

  if (!upVoted && !downVoted) {
    if (type === "plus") {
      currentComment.score++;
      currentComment.upVotesBy.push(username);
    } else if (type === "minus") {
      currentComment.score--;
      currentComment.downVotesBy.push(username);
    }
  }

  await currentComment.save();

  res.status(StatusCodes.OK).json({ score: currentComment.score });
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const commentToDelete = await Comment.findOne({ _id: id });
  const idToRemove = commentToDelete._id.toString();

  if (commentToDelete.level >= 1) {
    const commentWithReplies = await Comment.findOne({
      _id: commentToDelete.repliesTo,
    });
    if (commentWithReplies) {
      const newReplies = commentWithReplies.replies.filter((currentReply) => {
        return currentReply._id.toString() !== idToRemove;
      });

      commentWithReplies.replies = [...newReplies];
      await commentWithReplies.save();
    }
  }

  await Comment.deleteOne({ _id: id });
  res.status(StatusCodes.OK).json({ msg: "comment succsefully deleted " });
};

const replyToComment = async (req, res) => {
  const { id } = req.params;
  const { username, content } = req.body;
  const whoReplies = await User.findOne({ username });
  const commentToReply = await Comment.findOne({ _id: id });
  const newContent = `@${commentToReply.authorName}  ${content}`;
  const replyScore = 0;
  const replyReplies = [];
  const newLevel = commentToReply.level + 1;

  const newComment = await Comment.create({
    content: newContent,
    score: replyScore,
    authorName: username,
    authorPicture: whoReplies.image.png,
    replies: replyReplies,
    upVotesBy: [],
    downVotesBy: [],
    isReply: true,
    repliesTo: id,
    level: newLevel,
  });

  commentToReply.replies.push(newComment._id);
  await commentToReply.save();

  res.status(StatusCodes.CREATED).json("ok replied");
};

const editMyComment = async (req, res) => {
  const { id } = req.params;
  const { edited } = req.body;

  const commentToEdit = await Comment.findOne({ _id: id });

  commentToEdit.content = edited;

  await commentToEdit.save();

  res.status(StatusCodes.OK).json("ok edited");
};

module.exports = {
  createComment,
  deleteComment,
  getAllComments,
  vote,
  replyToComment,
  editMyComment,
};

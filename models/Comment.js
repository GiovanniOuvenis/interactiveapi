const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Cannot post blank comment"],
      minlength: 1,
    },
    score: {
      type: Number,
    },
    authorName: {
      type: String,
    },
    authorPicture: {
      type: String,
    },
    replies: { type: Array },
    upVotesBy: { type: Array },
    downVotesBy: { type: Array },
    isReply: {
      type: Boolean,
    },
    repliesTo: {
      type: String,
    },

    level: { type: Number },
  },

  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

const mongoose = require("mongoose");
const { UserSchema } = require("./User");

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
    replies: {
      type: Array,
    },
    upVotesBy: { type: Array },
    downVotesBy: { type: Array },
    isReply: {
      type: Boolean,
    },
  },

  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

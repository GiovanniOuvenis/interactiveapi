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
    user: {
      type: { username: String },
    },
    replies: {
      type: Array,
    },
    whoVoted: {
      type: Array,
    },
    isReply: {
      type: Boolean,
    },
  },

  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

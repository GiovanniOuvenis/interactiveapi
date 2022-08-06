const mongoose = require("mongoose");
const User = require("./User");

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
      username: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

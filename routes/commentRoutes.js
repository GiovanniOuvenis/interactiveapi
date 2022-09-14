const express = require("express");
const {
  createComment,
  deleteComment,
  getAllComments,
  changeScore,
  replyToComment,
} = require("../controllers/commentController");
const { authenticateUser } = require("../middleware/authenticate");

const router = express.Router();

router
  .route("/comments")
  .post(authenticateUser, createComment)
  .get(authenticateUser, getAllComments);

router
  .route("/comments/:id")
  .post(authenticateUser, replyToComment)
  .patch(authenticateUser, changeScore)
  .delete(authenticateUser, deleteComment);

module.exports = router;

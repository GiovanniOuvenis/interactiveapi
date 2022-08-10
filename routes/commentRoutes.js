const express = require("express");
const router = express.Router();
const {
  createComment,
  deleteComment,
  getAllComments,
  changeScore,
  replyToComment,
} = require("../controllers/commentController");
const { authenticateUser } = require("../middleware/authenticate");

router
  .route("/comment/allcoments")
  .post(authenticateUser, createComment)
  .get(getAllComments);

router
  .route("/comment/:id")
  .post(authenticateUser, replyToComment)
  .patch(changeScore)
  .delete(deleteComment);

module.exports = router;

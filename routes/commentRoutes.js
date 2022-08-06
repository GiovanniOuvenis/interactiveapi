const express = require("express");
const router = express.Router();
const {
  createComment,
  deleteComment,
} = require("../controllers/commentController");
const { authenticateUser } = require("../middleware/authenticate");

router
  .route("/comment")
  .post(authenticateUser, createComment)
  .delete(deleteComment);

module.exports = router;

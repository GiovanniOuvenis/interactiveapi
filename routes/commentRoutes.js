const express = require("express");
const router = express.Router();
const {
  createComment,
  deleteComment,
  getAllComments,
  getSingleComment,
} = require("../controllers/commentController");
const { authenticateUser } = require("../middleware/authenticate");

router
  .route("/comment/allcoments")
  .get(getAllComments)
  .post(authenticateUser, createComment);

router
  .route("/comment/:id")
  .post(authenticateUser)
  .get(getSingleComment)
  .delete(deleteComment);

module.exports = router;

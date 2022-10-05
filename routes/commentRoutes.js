const express = require("express");
const {
  createComment,
  deleteComment,
  getAllComments,
  vote,
  replyToComment,
} = require("../controllers/commentController");
const { authenticateUser } = require("../middleware/authenticate");

const router = express.Router();

router.route("/comments").post(createComment).get(getAllComments);

router
  .route("/comments/:id")
  .post(replyToComment)
  .patch(vote)
  .delete(deleteComment);

module.exports = router;

const express = require("express");
const {
  createComment,
  deleteComment,
  getAllComments,
  vote,
  replyToComment,
  editMyComment,
} = require("../controllers/commentController");

const router = express.Router();

router.route("/comments").post(createComment).get(getAllComments);

router
  .route("/comments/:id")
  .post(replyToComment)
  .patch(vote)
  .delete(deleteComment);

router.route("/:id").patch(editMyComment);
module.exports = router;

const express = require("express");
const router = express.Router();
const { createComment } = require("../controllers/commentController");
const { authenticateUser } = require("../middleware/authenticate");

router.route("/comment").post(authenticateUser, createComment);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  uploadImage,
} = require("../controllers/authController");

router.post("/upload", uploadImage);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;

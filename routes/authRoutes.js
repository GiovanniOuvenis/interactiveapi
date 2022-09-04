const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  uploadFoto,
} = require("../controllers/authController");

router.post("/uploadpic", uploadFoto);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;

const mongoose = require("mongoose");

const connectFunc = (url) => {
  mongoose.connect(url);
  console.log("connected");
};

module.exports = connectFunc;

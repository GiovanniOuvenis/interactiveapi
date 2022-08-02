const mongoose = require("mongoose");

const connectFunc = (url) => {
  mongoose.connect(url);
};

module.exports = connectFunc;

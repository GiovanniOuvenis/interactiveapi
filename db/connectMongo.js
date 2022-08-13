const mongoose = require("mongoose");

const connectFunc = (url) => {
  mongoose.connect(url).then(() => console.log("connected"));
};

module.exports = connectFunc;

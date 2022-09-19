const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: "http://localhost:3000", //frontend url
  credentials: true,
};

module.exports = corsOptions;

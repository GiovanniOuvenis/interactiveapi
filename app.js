require("dotenv").config();
require("express-async-errors");
const express = require("express");
const appFunc = express();
const appProcess = require("process");
const connectFunc = require("./db/connectMongo");
const authRouter = require("./routes/authRoutes");
const commentRouter = require("./routes/commentRoutes");
const cookieParser = require("cookie-parser");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandling = require("./middleware/error-handler");

appFunc.use(express.json());
appFunc.use(cookieParser(appProcess.env.JWT_SECRET));
appFunc.use("/intcommapi/v1/auth", authRouter);
appFunc.use("/intcommapi/v1", commentRouter);
appFunc.use(notFoundMiddleware);
appFunc.use(errorHandling);

const dbUrl = appProcess.env.MONGO_URL;
const port = appProcess.env.PORT || 3000;

const start = async () => {
  try {
    await connectFunc(dbUrl);
    appFunc.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

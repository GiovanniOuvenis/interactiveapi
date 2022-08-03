require("dotenv").config();
const express = require("express");
const appFunc = express();
const appProcess = require("process");
const connectFunc = require("./db/connectMongo");
const authRouter = require("./routes/authRoutes");

appFunc.use("/intcommapi/v1/auth", authRouter);

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

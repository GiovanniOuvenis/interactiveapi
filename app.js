require("dotenv").config();
const express = require("express");
const appFunc = express();
const appProcess = require("process");
const connectFunc = require("./db/connectMongo");

appFunc.get("/", (req, res) => {
  res.send("interactive comments api");
});

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

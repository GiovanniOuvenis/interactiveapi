require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const appProcess = require("process");
const corsOptions = require("./config/corsOptions");
const connectFunc = require("./db/connectMongo");
const authRouter = require("./routes/authRoutes");
const commentRouter = require("./routes/commentRoutes");
const cookieParser = require("cookie-parser");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandling = require("./middleware/error-handler");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(appProcess.env.JWT_SECRET));
app.use("/intcommapi/v1/auth", authRouter);
app.use("/intcommapi/v1", commentRouter);
app.use(notFoundMiddleware);
app.use(errorHandling);

const dbUrl = appProcess.env.MONGO_URL;
const port = appProcess.env.PORT || 3000;

const start = async () => {
  try {
    await connectFunc(dbUrl);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// connectDB
const connectDB = require("./db/connect");
const authenticatedUser = require("./middleware/authentication");

//routers
const userRouter = require("./routes/user");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/notfound");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/jobs", authenticatedUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB("test"); //process.env.MONGO_URI
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

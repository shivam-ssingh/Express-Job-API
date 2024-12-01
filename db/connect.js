const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect("mongodb://localhost:27017/project", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;

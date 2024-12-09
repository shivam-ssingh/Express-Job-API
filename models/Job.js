const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide job title"],
      maxlength: 100,
    },
    type: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Temporary"],
      required: [true, "Please specify the job type"],
    },
    description: {
      type: String,
      required: [true, "Please provide job description"],
    },
    location: {
      type: String,
      required: [true, "Please provide job location"],
    },
    salary: {
      type: String,
      required: [true, "Please specify salary"],
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    company: {
      name: {
        type: String,
        required: [true, "Please provide company name"],
        maxlength: 100,
      },
      description: {
        type: String,
        required: [true, "Please provide company description"],
      },
      contactEmail: {
        type: String,
        required: [true, "Please provide contact email"],
        match: [/.+\@.+\..+/, "Please provide a valid email address"],
      },
      contactPhone: {
        type: String,
        required: [true, "Please provide contact phone number"],
        match: [/^\d{10,15}$/, "Please provide a valid phone number"],
      },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);

const mongoose = require("mongoose");

const ApplicantSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeLink: {
      type: String,
      required: true,
    },
    applicationStatus: {
      type: String,
      enum: ["Applied", "Interview", "Declined", "Hired"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Applicant", ApplicantSchema);

const express = require("express");
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getApplicants,
  updateApplicantStatus,
} = require("../controllers/jobs");

const router = express.Router();

router.get("/", getAllJobs); // Get all jobs
router.get("/:jobId", getJob); // Get a specific job by ID
router.post("/", createJob); // Create a new job
router.patch("/:jobId", updateJob); // Update a job by ID
router.delete("/:jobId", deleteJob); // Delete a job by ID
router.post("/apply", applyToJob); // Apply to a job
router.get("/:jobId/applicants", getApplicants); // Get applicants for a job
router.patch("/:jobId/applicants/:applicantId", updateApplicantStatus); // Update an applicant's status

module.exports = router;

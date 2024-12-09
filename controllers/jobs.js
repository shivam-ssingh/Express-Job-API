const Job = require("../models/Job");
const Applicant = require("../models/Applicant");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const {
    status,
    position,
    sort,
    page = 1,
    limit = 10,
    forLoggedInUser = false,
  } = req.query;

  const queryObject = {};
  if (forLoggedInUser) queryObject.createdBy = req.user.userId;

  // Add filters
  if (status) queryObject.status = status;
  if (position) queryObject.position = { $regex: position, $options: "i" };

  let result = Job.find(queryObject);

  // Add sorting
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("-createdAt");
  }

  // Add pagination
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(Number(limit));

  const jobs = await result;

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { jobId: jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    // createdBy: userId,
  });

  const applicants = await Applicant.find({ jobId }).select("userId");
  const applicantIds = applicants.map((applicant) =>
    applicant.userId.toString()
  );
  const userPresent = applicantIds && applicantIds.includes(userId);
  console.log("applicants are----", applicants);
  if (!job) {
    throw new NotFoundError(`No job found with ID ${jobId}`);
  }

  const editable =
    job.createdBy && job.createdBy.toString() === userId.toString();

  res.status(StatusCodes.OK).json({
    job: { ...job.toObject(), editable },
    applicants: applicantIds,
    userPresent: userPresent,
  });
};

const createJob = async (req, res) => {
  // const { company, position } = req.body;

  // if (!company || !position) {
  //   throw new BadRequestError("Company and position are required fields.");
  // }

  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { jobId: jobId },
    body: { company, position, status, location },
  } = req;

  if (!company && !position && !status && !location) {
    throw new BadRequestError(
      "At least one field must be provided for update."
    );
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job found with ID ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { jobId: jobId },
  } = req;

  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job found with ID ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ message: "Job deleted successfully." });
};

const applyToJob = async (req, res) => {
  const { jobId, resumeLink } = req.body;

  // Validate input
  if (!resumeLink) {
    throw new BadRequestError("Resume link is required to apply.");
  }

  // Find the job
  const job = await Job.findById(jobId);
  if (!job || job.status !== "Open") {
    throw new NotFoundError("Job not found or closed.");
  }

  // Create the application
  const applicant = await Applicant.create({
    jobId,
    userId: req.user.userId,
    resumeLink,
  });

  // Update the User's appliedJobs array
  const user = await User.findById(req.user.userId);
  user.appliedJobs.push({
    jobId,
    status: "Pending",
  });

  await user.save(); // Save the updated user document

  // Send response
  res.status(StatusCodes.OK).json({
    message: "Application submitted successfully.",
    applicant,
  });
};

const getApplicants = async (req, res) => {
  const { jobId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const applicants = await Applicant.find({ jobId })
    .populate("userId", "name email") // Include user details
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.status(StatusCodes.OK).json({ applicants, count: applicants.length });
};

const updateApplicantStatus = async (req, res) => {
  const { applicantId } = req.params;
  const { applicationStatus } = req.body;

  if (
    !["Applied", "Interview", "Declined", "Hired"].includes(applicationStatus)
  ) {
    throw new BadRequestError("Invalid application status.");
  }

  const applicant = await Applicant.findByIdAndUpdate(
    applicantId,
    { applicationStatus },
    { new: true, runValidators: true }
  );

  if (!applicant) {
    throw new NotFoundError("Applicant not found.");
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Application status updated.", applicant });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getApplicants,
  updateApplicantStatus,
};

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },

    userRole: {
      type: String,
      enum: ["Candidate", "Employer"],
      default: "Candidate",
    },

    appliedJobs: [
      {
        jobId: {
          type: mongoose.Types.ObjectId,
          ref: "Job",
        },
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
          default: "Pending",
        },
      },
    ],

    emailVerified: {
      type: Boolean,
      default: false,
    },

    profilePicture: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash the password before saving the user document
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // Only hash if password is modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to create a JWT token
UserSchema.methods.createJWT = function () {
  console.log(process.env.JWT_LIFETIME);
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: parseInt(process.env.JWT_LIFETIME, 10) }
  );
};

// Method to compare entered password with stored password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

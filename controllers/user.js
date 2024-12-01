const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  try {
    const { name, email, password, userRole } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email already in use.");
    }

    // Create user
    const user = await User.create({ name, email, password, userRole });

    // Create JWT
    const token = user.createJWT();

    // Send response
    res.status(StatusCodes.CREATED).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userRole: user.userRole,
      },
      token,
    });
  } catch (error) {
    console.log("Registration error:", error);
    throw error;
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide both email and password.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials.");
  }

  // Compare the entered password with stored password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials.");
  }

  // Create JWT
  const token = user.createJWT();

  // Send response
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      userRole: user.userRole,
    },
    token,
  });
};

module.exports = {
  register,
  login,
};

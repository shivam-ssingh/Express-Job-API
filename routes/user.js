const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { login, register } = require("../controllers/user");

// User registration validation
const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name should be between 3 and 50 characters"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// User login validation
const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password is required and must be at least 6 characters"),
];

// Register route with validation
router.post("/register", registerValidation, register);

// Login route with validation
router.post("/login", loginValidation, login);

module.exports = router;

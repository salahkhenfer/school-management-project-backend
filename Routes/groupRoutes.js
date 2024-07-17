const express = require("express");
const {
  addStudent,
  getAllStudentsController,
} = require("../controllers/StudentController");
const asyncHandler = require("express-async-handler");

const router = express.Router();

router.post(
  "/checkLocationAvailability",
  asyncHandler(checkLocationAvailability)
);

const express = require("express");
const router = express.Router();
const {
  addCourse,
  getAllCourses,
  deleteCourse,
} = require("../controllers/coursController");
const authenticate = require("../Middlewares/Auth/authenticate");
const asyncHandler = require("express-async-handler");

router.post("/addCourse", authenticate, asyncHandler(addCourse));
router.get("/getAllCourses", authenticate, asyncHandler(getAllCourses));
router.delete("/deleteCourse", authenticate, asyncHandler(deleteCourse));

module.exports = router;

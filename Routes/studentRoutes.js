const express = require("express");
const {
  addStudent,
  getAllStudentsController,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/StudentController");
const asyncHandler = require("express-async-handler");
const authenticate = require("../Middlewares/Auth/authenticate");

const router = express.Router();

router.post("/addStudent", authenticate, asyncHandler(addStudent));
router.get(
  "/getAllStudents",
  authenticate,
  asyncHandler(getAllStudentsController)
);

router.get("/getStudentById", authenticate, asyncHandler(getStudentById));
router.put("/updateStudent", authenticate, asyncHandler(updateStudent));
router.delete("/deleteStudent", authenticate, asyncHandler(deleteStudent));

module.exports = router;

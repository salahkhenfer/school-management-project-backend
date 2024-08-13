const express = require("express");
const {
  getAllStudentsController,
  getStudentById,
  updateStudent,
  deleteStudent,
  addStudent,
  searchStudent,
  countStudents,
  deleteStudentFropmGroup,
} = require("../controllers/StudentController");
const asyncHandler = require("express-async-handler");
const authenticate = require("../Middlewares/Auth/authenticate");
const { Sequelize } = require("sequelize");
const Student = require("../Models/Student");

const router = express.Router();

router.post("/addStudent", authenticate, asyncHandler(addStudent));
router.post(
  "/getAllStudents",
  authenticate,
  asyncHandler(getAllStudentsController)
);

router.post("/getStudentById", asyncHandler(getStudentById));
router.put("/updateStudent", asyncHandler(updateStudent));
router.delete("/deleteStudent", authenticate, asyncHandler(deleteStudent));
router.post("/searchStudent", authenticate, asyncHandler(searchStudent));
router.get("/countStudents", asyncHandler(countStudents));
router.delete(
  "/deleteStudentFropmGroup",
  authenticate,
  asyncHandler(deleteStudentFropmGroup)
);
router.get("/monthly-student-count", async (req, res) => {
  try {
    const studentCounts = await Student.findAll({
      attributes: [
        [Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m')"), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: [Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m')")],
      order: [[Sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m')"), "ASC"]],
    });

    res.json(studentCounts);
  } catch (error) {
    console.error("Error fetching student counts:", error);
    res.status(500).json({
      error: "Failed to fetch student counts",
      details: error.message,
    });
  }
});

module.exports = router;

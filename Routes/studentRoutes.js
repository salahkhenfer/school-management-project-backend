const express = require("express");
const {
  getAllStudentsController,
  getStudentById,
  updateStudent,
  deleteStudent,
  addStudent,
  searchStudent,
  countStudents,
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
router.get("/monthly-student-count", async (req, res) => {
  try {
    const studentCounts = await Student.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("createdAt")),
          "month",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: [Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("createdAt"))],
      order: [
        [
          Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("createdAt")),
          "ASC",
        ],
      ],
    });

    res.json(studentCounts);
  } catch (error) {
    console.error("Error fetching student counts:", error);
    res.status(500).json({ error: "Failed to fetch student counts" });
  }
});
module.exports = router;

const express = require("express");
const {
  addTeachers,
  GetAllTeachers,
  getTeacherById,
  deleteTeacher,
  searchTeachers,
  countTeachers,
  getTeacherWithUser,
} = require("../controllers/TeachersController");
const authenticate = require("../Middlewares/Auth/authenticate");

const router = express.Router();

router.post("/addTeacher", authenticate, addTeachers);
router.get("/GetAllTeacher", authenticate, GetAllTeachers);
router.post("/GetTeacherById", getTeacherById);
router.delete("/DeleteTeacher", deleteTeacher);
router.post("/searchTeachers", searchTeachers);
router.get("/countTeachers", countTeachers);
router.post("/getTeacherWithUser", getTeacherWithUser);

module.exports = router;

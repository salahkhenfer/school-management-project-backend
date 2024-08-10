const express = require("express");
const {
  addStudent,
  getAllStudentsController,
} = require("../controllers/StudentController");
const asyncHandler = require("express-async-handler");
const authenticate = require("../Middlewares/Auth/authenticate");
const {
  addgroup,
  checkLocationAvailability,
  getAllGroup,
  addGroup,
  getGroupByID,
  deleteGroup,
  updateGroupStatus,
  updateGroup,
  getGroupByTeacher,
} = require("../controllers/GroupController");

const router = express.Router();

router.post(
  "/checkLocationAvailability",
  asyncHandler(checkLocationAvailability)
);

router.post("/addgroup", authenticate, addGroup);
router.post("/getAllGroups", authenticate, getAllGroup);
router.post("/getGroupByID", getGroupByID);
router.delete("/deleteGroup", deleteGroup);
router.put("/updateGroupStatus", updateGroupStatus);
router.put("/updateGroup", updateGroup);
router.post("/getGroupByTeacher", getGroupByTeacher);

module.exports = router;

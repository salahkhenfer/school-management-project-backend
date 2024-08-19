const express = require("express");
const router = express.Router();

const {
  getParentById,
  updateParent,
  deleteParent,
  addParent,
  searchParent,
  getAllParents,
  addStudentInToParent,
  deleteStudentForParent,
  checkParent,
  deleteStudentFromParent,
  countParents,
  getGroupsWithStudentsAndSessionsApi,
  getParentWithUser,
} = require("../controllers/parentController");
const asyncHandler = require("express-async-handler");

const authenticate = require("../Middlewares/Auth/authenticate");

router.post("/addParent", authenticate, asyncHandler(addParent));
router.get("/getAllParents", authenticate, asyncHandler(getAllParents));
router.post("/getParentById", asyncHandler(getParentById));
router.put("/updateParent", asyncHandler(updateParent));
router.delete("/deleteParent", asyncHandler(deleteParent));
router.post("/searchParent", asyncHandler(searchParent));
router.post("/addStudentInToParent", asyncHandler(addStudentInToParent));
router.delete("/deleteStudentForParent", asyncHandler(deleteStudentForParent));
router.post("/checkParent", asyncHandler(checkParent));
countParents;
router.get("/countParents", countParents);
router.delete(
  "/deleteStudentFormParent",
  asyncHandler(deleteStudentFromParent)
);
router.post(
  "/getGroupsWithStudentsAndSessionsApi",
  asyncHandler(getGroupsWithStudentsAndSessionsApi)
);

router.post("/getParentWithUser", asyncHandler(getParentWithUser));

module.exports = router;

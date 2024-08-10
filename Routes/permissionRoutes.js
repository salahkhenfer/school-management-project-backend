const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  createPermission,
  getAllPermissions,
  getUsersByRole,
} = require("../controllers/PermissionController");

router.post("/createPermissio", asyncHandler(createPermission));
router.post("/getUsersByRole", asyncHandler(getUsersByRole));
router.get("/getPermissions", asyncHandler(getAllPermissions));

module.exports = router;

const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const {
  addSessionToGroup,
  getSessionById,
  getSessions,
} = require("../controllers/sessionController");

router.post("/addSessionToGroup", asyncHandler(addSessionToGroup));
router.get("/getSessions", asyncHandler(getSessions));
router.post("/getSessionById", asyncHandler(getSessionById));

module.exports = router;

const express = require("express");

const asyncHandler = require("express-async-handler");
const authenticate = require("../Middlewares/Auth/authenticate");
const {
  addSchedule,
  getAllFreeRegiments,
  addRegiment,
  deleteSchedule,
  getScheduleById,
  updateSchedule,
  getAllSchedule,
  getAllRegiments,
  deleteRegiment,
} = require("../controllers/scheduleController");
const router = express.Router();

router.post("/addSchedule", authenticate, addSchedule);
router.post("/getAllFreeRegiments", authenticate, getAllFreeRegiments);
router.post("/addRegiment", authenticate, addRegiment);
router.post("/getScheduleById", authenticate, getScheduleById);
router.delete("/deleteSchedule", authenticate, deleteSchedule);
router.put("/updateSchedule", updateSchedule);
router.get("/getAllSchedule", authenticate, getAllSchedule);
router.get("/getAllRegiments", getAllRegiments);
router.delete("/deleteRegiment", authenticate, deleteRegiment);
module.exports = router;

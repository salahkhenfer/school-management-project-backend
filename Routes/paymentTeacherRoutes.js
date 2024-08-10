const express = require("express");

const authenticate = require("../Middlewares/Auth/authenticate");
const {
  addPaymentTeacherToGroup,
  getPaymentByTeacher,
  getAllPaymentsTeacher,
} = require("../controllers/paymentTeacherController");
const e = require("express");
const { getAllPayments } = require("../controllers/paymentsController");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.post("/addPaymentTeacher", authenticate, addPaymentTeacherToGroup);
router.post("/getPaymentTeacher", getPaymentByTeacher);
router.post("/getAllPayments", asyncHandler(getAllPaymentsTeacher));

module.exports = router;

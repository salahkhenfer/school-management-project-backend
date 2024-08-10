const express = require("express");
const router = express.Router();
const {
  getAllPayments,
  getPaymentByGroup,
} = require("../controllers/paymentsController");
const authenticate = require("../Middlewares/Auth/authenticate");
const asyncHandler = require("express-async-handler");

router.get("/getAllPayments", authenticate, asyncHandler(getAllPayments));
router.post(
  "/getPaymentByGroup",
  authenticate,
  asyncHandler(getPaymentByGroup)
);
module.exports = router;

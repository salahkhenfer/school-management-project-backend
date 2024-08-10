const express = require("express");
const router = express.Router();

const authenticate = require("../Middlewares/Auth/authenticate");
const asyncHandler = require("express-async-handler");
const {
  getAllPaymentsEmployer,
  addPaymentEmployer,
  SearchPaymentEmployer,
} = require("../controllers/PaymentEmployerController");

router.post("/addPaymentEmployer", asyncHandler(addPaymentEmployer));
router.get("/getAllPaymentEmployer", asyncHandler(getAllPaymentsEmployer));
router.post("/searchPaymentEmployer", asyncHandler(SearchPaymentEmployer));

module.exports = router;

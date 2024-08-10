const asyncHandler = require("express-async-handler");
const PaymentEmployer = require("../Models/PaymentEmployer");
const { Op } = require("sequelize");

const addPaymentEmployer = asyncHandler(async (req, res) => {
  const { amount, employerName } = req.body;

  if (!amount || !employerName) {
    return res
      .status(400)
      .json({ message: "Amount and Employer Name are required" });
  }
  try {
    const newPayment = await PaymentEmployer.create({
      amount,
      employerName,
    });
    res.status(201).json(newPayment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to create payment", details: error.message });
  }
});

const getAllPaymentsEmployer = asyncHandler(async (req, res) => {
  try {
    const payments = await PaymentEmployer.findAll();
    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch payments", details: error.message });
  }
});

const SearchPaymentEmployer = asyncHandler(async (req, res) => {
  const { employerName } = req.body;

  try {
    // Fetch payments where employerName matches (case-insensitive)
    const payments = await PaymentEmployer.findAll({
      where: {
        employerName: {
          [Op.like]: `%${employerName}%`, // Case-insensitive partial match
        },
      },
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch payments", details: error.message });
  }
});
module.exports = {
  addPaymentEmployer,
  getAllPaymentsEmployer,
  SearchPaymentEmployer,
};

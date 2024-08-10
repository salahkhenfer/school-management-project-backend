// @desc Get all payments
// @route GET /api/v1/payments
// @access Public

const Group = require("../Models/Group");
const PaymentTeacher = require("../Models/PaymentTeacher");
const Teacher = require("../Models/Teacher");

const getPayments = async (req, res, next) => {
  try {
    const payments = await PaymentTeacher.findAll({
      include: [
        {
          model: Teacher,
          as: "teacher",
          attributes: ["id", "fullName"],
        },
      ],
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

// @desc Get payment by teacher
// @route GET /api/v1/payments/teacher/:teacherId
// @access Public

const getPaymentByTeacher = async (req, res, next) => {
  const { teacherId } = req.body;

  try {
    const payments = await PaymentTeacher.findAll({
      where: { teacherId },
      include: [
        {
          model: Teacher,
          as: "paymentTeacherTeacher",
          attributes: ["id", "fullName"],
        },
        {
          model: Group,
          as: "paymentTeacherGroup",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

const addPaymentTeacherToGroup = async (req, res, next) => {
  const { teacherId, groupId, amount } = req.body;

  // Validate input

  try {
    // Check if a payment already exists for the given teacher and group
    const existingPayment = await PaymentTeacher.findOne({
      where: { teacherId, groupId },
    });

    if (existingPayment) {
      // If a payment exists, you can either update it or respond with an error
      return res
        .status(400)
        .json({ error: "Payment already exists for this teacher and group" });
    }

    // Create new payment
    const payment = await PaymentTeacher.create({
      teacherId,
      groupId,
      amount,
      isPaid: amount > 0 ? true : false,
    });

    res.status(201).json({ payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add payment" });
  }
};

const getAllPaymentsTeacher = async (req, res) => {
  try {
    const payments = await PaymentTeacher.findAll({
      include: [
        {
          model: Teacher,
          as: "paymentTeacherTeacher", // use the alias defined in the model
          attributes: ["id", "fullName"],
        },
        {
          model: Group,
          as: "paymentTeacherGroup", // use the alias defined in the model
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch payments", error });
  }
};

module.exports = {
  getPayments,
  getPaymentByTeacher,
  addPaymentTeacherToGroup,
  getAllPaymentsTeacher,
};

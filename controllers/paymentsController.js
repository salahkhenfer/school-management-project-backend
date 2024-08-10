const Group = require("../Models/Group");
const Parent = require("../Models/Parent");
const Payment = require("../Models/Payment");
const Student = require("../Models/Student");

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Student,
          as: "student", // Alias used in the association
          attributes: ["id", "fullName"], // Adjust attributes as needed
        },
        {
          model: Group,
          as: "groups", // Alias used in the association
          attributes: ["id", "name"], // Adjust attributes as needed
        },
      ],
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch payments", details: error.message });
  }
};
const getPaymentByGroup = async (req, res) => {
  const { groupId } = req.body;

  try {
    const payments = await Payment.findAll({
      where: { groupId },
      include: [
        {
          model: Student,
          as: "student",
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

module.exports = {
  getAllPayments,
  getPaymentByGroup,
};

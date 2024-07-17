const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./Student");
const Course = require("./Course");

const Payment = sequelize.define("Payment", {
  amount: {
    type: DataTypes.DECIMAL(10, 2), // Example: storing amount as decimal
    allowNull: false,
  },
});

Payment.belongsTo(Student);
Payment.belongsTo(Course);

module.exports = Payment;

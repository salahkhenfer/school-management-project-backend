const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PaymentEmployer = sequelize.define(
  "paymentEmployer",
  {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    employerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = PaymentEmployer;

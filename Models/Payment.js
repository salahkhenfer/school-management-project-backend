const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./Student");
const Group = require("./Group");

const Payment = sequelize.define("Payment", {
  amount: {
    type: DataTypes.DECIMAL(10, 2), // Storing amount as decimal
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: "id",
    },
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Make this field optional if not used
    references: {
      model: Group,
      key: "id",
    },
  },
});

// Associations
Payment.belongsTo(Student, { as: "student", foreignKey: "studentId" });
Payment.belongsTo(Group, { as: "group", foreignKey: "groupId" });
Student.hasMany(Payment, { as: "payments", foreignKey: "studentId" });
Group.hasMany(Payment, { as: "payments", foreignKey: "groupId" });

module.exports = Payment;

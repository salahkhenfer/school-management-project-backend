const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Teacher = require("./Teacher");
const Group = require("./Group");

const PaymentTeacher = sequelize.define("PaymentTeacher", {
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2), // Storing amount as decimal
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Teacher,
      key: "id",
    },
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Make this field optional if not used
    references: {
      model: Group,
      key: "id",
    },
  },
});

// Associations
PaymentTeacher.belongsTo(Teacher, {
  as: "paymentTeacherTeacher",
  foreignKey: "teacherId",
});
PaymentTeacher.belongsTo(Group, {
  as: "paymentTeacherGroup",
  foreignKey: "groupId",
});

// Teacher associations
Teacher.hasMany(PaymentTeacher, {
  as: "teacherPayments",
  foreignKey: "teacherId",
});

// Group associations
Group.hasOne(PaymentTeacher, { as: "groupPayments", foreignKey: "groupId" });

module.exports = PaymentTeacher;

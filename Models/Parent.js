const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./Student");

const Parent = sequelize.define(
  "Parent",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
); // Assuming Parent belongs to a Student

// Parent.belongsTo(Student, { foreignKey: "studentId" });
module.exports = Parent;

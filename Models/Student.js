const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Assuming this correctly initializes Sequelize

const Course = require("./Course"); // Assuming Course model is correctly defined
const Parent = require("./Parent"); // Assuming Parent model is correctly defined

const Student = sequelize.define(
  "Student",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regiments: {
      // Corrected to lowercase 'regiments'
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define associations
Student.belongsToMany(Course, { through: "StudentCourse" });
Course.belongsToMany(Student, { through: "StudentCourse" });

Student.hasOne(Parent, { foreignKey: "studentId", as: "parent" });
Parent.belongsTo(Student, { foreignKey: "studentId" });
// Assuming 'parent' refers to the Parent model's alias

module.exports = Student;

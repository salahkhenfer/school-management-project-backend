const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure this correctly initializes Sequelize

const Course = require("./Course"); // Ensure these paths are correct
const Parent = require("./Parent");
const Session = require("./Session");
const Group = require("./Group");

const Student = sequelize.define(
  "Student",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDay: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
    },
  },
  {
    timestamps: true,
  }
);

// Associations
// Group - Student (Many-to-Many)
Group.belongsToMany(Student, { through: "StudentGroup", as: "students" });
Student.belongsToMany(Group, { through: "StudentGroup", as: "groups" });

// Course - Student (Many-to-Many)
Course.belongsToMany(Student, { through: "StudentCourse", as: "students" });
Student.belongsToMany(Course, { through: "StudentCourse", as: "courses" });

// Parent - Student (One-to-Many)
Parent.hasMany(Student, { foreignKey: "parentId", as: "students" });
Student.belongsTo(Parent, { foreignKey: "parentId", as: "parent" });

// Session - Student (Many-to-Many)
Session.belongsToMany(Student, { through: "SessionStudent", as: "students" });
Student.belongsToMany(Session, { through: "SessionStudent", as: "sessions" });

module.exports = Student;

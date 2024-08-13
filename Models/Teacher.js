const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Assuming this correctly initializes Sequelize
const Student = require("./Student");
const Group = require("./Group");
const bcrypt = require("bcrypt");
const User = require("./User");

const Teacher = sequelize.define("Teacher", {
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Teacher.hasMany(Student, { through: "StudentTeacher" });
// Student.belongsToMany(Teacher, { through: "StudentTeacher" });

// Teacher.belongsToMany(Group, { through: "TeacherGroup" });

// Hook to create a User when a Teacher is created
Teacher.addHook("afterCreate", async (teacher, options) => {
  try {
    await User.create({
      name: teacher.fullName,
      email: teacher.email,
      phone: teacher.phoneNumber,
      username: teacher.email,
      // Assuming email is used as username
      password: teacher.password,
      // Set a default password, should be hashed
      role: "teacher",
    });
  } catch (error) {
    console.error("Error creating associated User:", error);
  }
});

module.exports = Teacher;

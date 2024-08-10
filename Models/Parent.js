const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./Student");
const bcrypt = require("bcrypt");

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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    timestamps: true,
  }
);
// Assuming Parent belongs to a Student
Parent.addHook("afterCreate", async (parent, options) => {
  var hashedPassword = "";
  try {
    if (parent.password) {
      hashedPassword = await bcrypt.hash(parent.password, 10);
      parent.password = hashedPassword;
    }
    await User.create({
      name: parent.fullName,
      email: parent.email,
      phone: parent.phoneNumber,
      username: parent.email,
      // Assuming email is used as username
      password: hashedPassword,
      // Set a default password, should be hashed
      role: "parent",
    });
  } catch (error) {
    console.error("Error creating associated User:", error);
  }
});
// Parent.hasMany(Student, { foreignKey: "parentId", as: "students" });

module.exports = Parent;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");
const User = require("./User");

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

// Hash the password before creating the Parent record
// Parent.beforeCreate(async (parent, options) => {
//   try {
//     if (parent.password) {
//       const hashedPassword = await bcrypt.hash(parent.password, 10);
//       parent.password = hashedPassword;
//     }
//   } catch (error) {
//     console.error("Error hashing password:", error);
//     throw error;
//   }
// });

// Create an associated User record after Parent is created
Parent.afterCreate(async (parent, options) => {
  try {
    console.log("Creating User with password:", parent.password); // Debugging line
    await User.create({
      name: parent.fullName,
      email: parent.email,
      phone: parent.phoneNumber,
      username: parent.email,
      password: parent.password, // Ensure this is the hashed password
      role: "parent",
    });
  } catch (error) {
    console.error("Error creating associated User:", error);
  }
});

// Uncomment if needed
// Parent.hasMany(Student, { foreignKey: "parentId", as: "students" });

module.exports = Parent;

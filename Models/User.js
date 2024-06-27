const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "sub-admin", "father", "teacher", "employee"),
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
  },
});

module.exports = User;

// models/RefreshToken.js

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const RefreshToken = sequelize.define("RefreshToken", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = RefreshToken;

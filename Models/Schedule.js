// models/Schedule.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Assuming this correctly initializes Sequelize

const Schedule = sequelize.define("Schedule", {
  day: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

module.exports = Schedule;

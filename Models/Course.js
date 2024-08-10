const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Assuming this correctly initializes Sequelize

const Course = sequelize.define("Course", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Course;

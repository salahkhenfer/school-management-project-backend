const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Academy = sequelize.define("Academy", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Academy;

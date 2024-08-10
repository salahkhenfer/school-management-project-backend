const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Level = require("./Level");
const Group = require("./Group");
const Language = sequelize.define("Language", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Language.hasMany(Level, { as: "Levels", foreignKey: "languageId" });

module.exports = Language;

const sequelize = require("../config/db");
const Language = require("./Language");
const { DataTypes } = require("sequelize");
const Course = require("./Course");
const Group = require("./Group");
const Level = sequelize.define("Level", {
  code: {
    type: DataTypes.ENUM("preA1", "A1", "A2", "B1", "B2", "C1", "C2"),
    allowNull: false,
  },
});
Level.belongsTo(Language, { as: "Language", foreignKey: "languageId" });

// Level.hasMany(Group, { as: "groups", foreignKey: "GroupId" });
module.exports = Level;

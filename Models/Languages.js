const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Language = require("./Language");

const Languages = sequelize.define("Languages", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Languages.hasMany(Language, { as: "Languages", foreignKey: "languagesId" });
Language.belongsTo(Languages, { as: "Languages", foreignKey: "languagesId" });

module.exports = Languages;

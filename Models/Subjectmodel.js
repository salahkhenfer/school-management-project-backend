const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Group = require("./Group");
const SubjectModel = sequelize.define("SubjectModel", {
  tawar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

SubjectModel.hasMany(Group, { as: "groups", foreignKey: "subjectId" });

module.exports = SubjectModel;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Group = require("./Group");
const Student = require("./Student");

const Session = sequelize.define("Session", {
  isCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  sessionNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Session.belongsTo(Group, { as: "group", foreignKey: "groupId" });
Group.hasMany(Session, { as: "sessions", foreignKey: "groupId" });

// Each session belongs to one group

// Session.belongsToMany(Student, { through: "SessionStudent" });
// Student.belongsToMany(Session, { through: "SessionStudent" });
module.exports = Session;

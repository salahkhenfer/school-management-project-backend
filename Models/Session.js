const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Group = require("./Group");
const Student = require("./Student");

const Session = sequelize.define("Session", {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});
Session.belongsTo(Group);

// Each session belongs to one group

// Session.belongsToMany(Student, { through: "SessionStudent" });
// Student.belongsToMany(Session, { through: "SessionStudent" });
module.exports = Session;

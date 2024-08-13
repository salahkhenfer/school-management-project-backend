const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./Student");
const Teacher = require("./Teacher");
const Schedule = require("./Schedule");
const Session = require("./Session");
const Level = require("./Level");

const Group = sequelize.define("Group", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  theRest: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  numberOfSessions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM("percentage", "session"),
    allowNull: false,
  },
});

// Group - Teacher (Many-to-Many)
Group.belongsToMany(Teacher, { through: "TeacherGroup", as: "teachers" });
Teacher.belongsToMany(Group, { through: "TeacherGroup", as: "groups" });

// Group - Schedule (One-to-Many)
Group.hasMany(Schedule, {
  foreignKey: "groupId", // Ensure this matches the foreign key in Schedule
  as: "schedules",
  onDelete: "CASCADE",
});
Schedule.belongsTo(Group, {
  foreignKey: "groupId",
  as: "group",
  onDelete: "CASCADE",
});
Group.belongsTo(Level, { as: "Level", foreignKey: "GroupId" });

// // Group - Session (One-to-Many)
// Group.hasMany(Session);
// Session.belongsTo(Group);

module.exports = Group;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./Student");
const Teacher = require("./Teacher");
const Schedule = require("./Schedule");
const Session = require("./Session");

const Grupe = sequelize.define(
  "Grupe",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
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
    duration: {
      type: DataTypes.INTEGER,
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
  },
  {
    hooks: {
      afterCreate: async (grupe, options) => {
        const sessions = [];
        const sessionDuration = grupe.duration; // Assuming duration is in days
        for (let i = 0; i < grupe.numberOfSessions; i++) {
          const sessionDate = new Date(grupe.startDate);
          sessionDate.setDate(sessionDate.getDate() + i * sessionDuration);
          sessions.push({
            date: sessionDate,
            GrupeId: grupe.id,
          });
        }
        await Session.bulkCreate(sessions);
      },
    },
  }
);

Grupe.belongsToMany(Student, { through: "StudentGrupe" });
Student.belongsToMany(Grupe, { through: "StudentGrupe" });

Grupe.belongsToMany(Teacher, { through: "TeacherGrupe" });
Teacher.belongsToMany(Grupe, { through: "TeacherGrupe" });

Grupe.hasMany(Schedule, { as: "Schedules" });
Schedule.belongsTo(Grupe);

Grupe.hasMany(Session, { as: "Sessions" });
Session.belongsTo(Grupe);

module.exports = Grupe;

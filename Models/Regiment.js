const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Schedule = require("./Schedule");

const Regiment = sequelize.define("Regiment", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Regiment.belongsTo(Schedule, { through: "RegimentSchedule" });
Schedule.hasOne(Regiment, { through: "RegimentSchedule" });

module.exports = Regiment;

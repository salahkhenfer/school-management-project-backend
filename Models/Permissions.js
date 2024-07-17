const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Permissions = sequelize.define("Permissions", {
  name: {
    type: DataTypes.ENUM(
      "all",
      "manageCourses",
      "manangeUsers",
      "managePayments",
      "mangeAdmins"
    ),
    allowNull: false,
  },
});

module.exports = Permissions;

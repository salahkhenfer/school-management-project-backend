// models/Permission.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Permission = sequelize.define("Permission", {
  permissionType: {
    type: DataTypes.ENUM("classes", "users", "financial"),
    allowNull: false,
  },
});

// Permission - User (Many-to-Many)
Permission.belongsToMany(User, { through: "UserPermission", as: "users" });
User.belongsToMany(Permission, {
  through: "UserPermission",
  as: "permissions",
});

module.exports = Permission;

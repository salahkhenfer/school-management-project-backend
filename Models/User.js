const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,

    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "sub-admin", "parent", "teacher", "employee"),
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
  },
});

User.hasMany(User, { as: "SubAdmins", foreignKey: "adminId" });
User.belongsTo(User, { as: "Admin", foreignKey: "adminId" });
module.exports = User;

// Initialize Sequelize and connect to the database

const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Create a new Sequelize instance with the database configuration
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Disable logging; default: console.log
  }
);

// Synchronize the database
sequelize
  .sync({
    force: false, // Set to true to drop and recreate the tables on every sync
  })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((error) => {
    console.error("Failed to synchronize database:", error);
  });

module.exports = sequelize;

// const Sequelize = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "mysql",
//     logging: false,
//   }
// );

// sequelize
//   .sync({
//     force: false,
//   })
//   .then(() => {
//     console.log("Database synchronized");
//   })
//   .catch((error) => {
//     console.error("Failed to synchronize database:", error);
//   });

// module.exports = sequelize;
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Log environment variables to ensure they are loaded correctly
console.log("Database Name:", process.env.DB_DATABASE);
console.log("Database User:", process.env.DB_USER);
console.log("Database Host:", process.env.DB_HOST);

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

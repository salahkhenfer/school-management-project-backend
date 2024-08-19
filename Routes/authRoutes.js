const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User"); // Adjust the path to your User model
const router = express.Router();

const {
  loginController,
  registerController,
  logoutController,
  getUserById,
} = require("../controllers/AuthController");
const asyncHandler = require("express-async-handler");
const authenticate = require("../Middlewares/Auth/authenticate");

router.post("/login", asyncHandler(loginController));

router.post("/register", asyncHandler(registerController));

router.post("/logout", asyncHandler(logoutController));

router.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "You have access to this protected route",
    user: req.user,
  });
});
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();

  // decrypt password
  users.forEach((user) => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  });

  res.json(users);
});
router.post("/getUserById", getUserById);

router.get("/getAllUsers", getAllUsers);
module.exports = router;

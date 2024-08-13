const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../Middlewares/Auth/tokens");
const RefreshToken = require("../Models/Auth/RefreshToken");

const loginController = async (req, res) => {
  const { username, password } = req.body;

  // Validate the received data
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Find the user in the database
    const user = await User.findOne({ where: { username } });

    // Generate tokens
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({
      id: user.id,
      role: user.role,
    });

    // Store refresh token in user model
    user.refreshToken = refreshToken;
    await user.save();

    // Prepare response without returning sensitive data
    const {
      password: userPassword,
      refreshToken: userRefreshToken,
      ...userResponse
    } = user.toJSON();

    // Set cookies for tokens
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    // Send success response
    res.json({ message: "Logged in successfully", user: userResponse });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const registerController = async (req, res) => {
  const { name, email, phone, username, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await User.create({
      name,
      email,
      phone,
      username,
      password: hashedPassword,
      role,
    });

    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error });
  }
};

const logoutController = async (req, res) => {
  try {
    // Extract refreshToken from cookies
    const { refreshToken } = req.cookies;

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // Send success response
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { loginController, registerController, logoutController };

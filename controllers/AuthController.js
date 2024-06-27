const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../Middlewares/Auth/tokens");

const loginController = async (req, res) => {
  const { username, password } = req.body;

  // Log the received data
  console.log("Received data:", { username, password });

  // Validate the received data
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    user.refreshToken = refreshToken;
    await user.save();
    const { password: userPassword, ...userResponse } = user.toJSON();

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.json({ message: "Logged in successfully", user: userResponse });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { loginController };

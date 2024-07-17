// routes/protectedRoutes.js

const express = require("express");
const router = express.Router();
const authenticate = require("../Middlewares/Auth/authenticate");
const authorize = require("../Middlewares/Auth/authorize");

// This route can be accessed by users with the 'admin' role
router.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.send("Admin content");
});

// This route can be accessed by users with the 'teacher' role
router.get("/teacher", authenticate, authorize("teacher"), (req, res) => {
  res.send("Teacher content");
});
router.get("/father", authenticate, authorize("father"), (req, res) => {
  res.send("father");
});

// This route can be accessed by users with 'admin' or 'sub-admin' roles
router.get(
  "/admin-or-subadmin",
  authenticate,
  authorize(["admin", "sub-admin"]),
  (req, res) => {
    res.send("Admin or Sub-Admin content");
  }
);

module.exports = router;

// middlewares/authorize.js

const authorize = (roles = []) => {
  // If roles parameter is a string, convert it to an array
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    // Check if the user's role is included in the roles array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }
    next(); // Proceed to the next middleware/route handler
  };
};

module.exports = authorize;

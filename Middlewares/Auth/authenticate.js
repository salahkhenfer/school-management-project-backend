// middlewares/authenticate.js

const jwt = require("jsonwebtoken");
const User = require("../../Models/User");
const { RefreshToken } = require("../../Models/Auth/RefreshToken"); // Assuming you have a RefreshToken model

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken; // Assuming refresh token can also be passed in headers

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify access token
    const decodedAccessToken = jwt.decode(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Attach user to request
    const user = await User.findByPk(decodedAccessToken.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Token is valid but user not found" });
    }
    const {
      password: userPassword,
      refreshToken: userRefreshToken,
      ...userResponse
    } = user.toJSON();
    req.user = userResponse;

    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    // Access token verification failed, check if it's expired
    if (err.name === "TokenExpiredError") {
      try {
        // Verify refresh token if access token expired
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        // Check if refresh token is valid and belongs to the user
        const storedRefreshToken = await RefreshToken.findOne({
          where: { userId: decodedRefreshToken.id, token: refreshToken },
        });

        if (!storedRefreshToken) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
          {
            id: decodedRefreshToken.id,
            username: decodedRefreshToken.username,
            role: decodedRefreshToken.role,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        // Update cookies with new access token
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "None", // Adjust as per your requirements
          secure: true, // Ensure this is set to true in production with HTTPS
          maxAge: 60 * 60 * 1000, // 1 hour expiration
        });

        // Continue with the request
        req.user = {
          id: decodedRefreshToken.id,
          username: decodedRefreshToken.username,
          role: decodedRefreshToken.role,
        };
        next();
      } catch (error) {
        // Refresh token verification failed
        return res.status(401).json({ message: "Refresh token is not valid" });
      }
    } else {
      // Other JWT errors (malformed token, etc.)
      return res.status(401).json({ message: "Token is not valid" });
    }
  }
};

module.exports = authenticate;

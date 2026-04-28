const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =========================
   PROTECT MIDDLEWARE
========================= */
const protect = async (req, res, next) => {
  try {
    let token;

    // GET TOKEN FROM HEADER
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    );

    // GET USER FROM DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.active === false) {
      return res.status(401).json({
        message: "User not found or inactive",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

module.exports = protect;
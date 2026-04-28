const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      /* ======================
         USER CHECK
      ====================== */
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized - user missing",
        });
      }

      /* ======================
         ROLE SAFETY CHECK
      ====================== */
      const userRole = req.user.role;

      if (!userRole) {
        return res.status(403).json({
          message: "User role not assigned",
        });
      }

      /* ======================
         ROLE AUTHORIZATION
      ====================== */
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      console.error("Role Middleware Error:", error.message);

      res.status(500).json({
        message: "Authorization middleware failed",
      });
    }
  };
};

module.exports = authorize;
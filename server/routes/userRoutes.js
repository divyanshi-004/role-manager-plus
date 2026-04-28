const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const userController = require("../controllers/userController");

/* ================= AUTH ROUTES ================= */

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

/* ================= ADMIN ROUTES ================= */

router.post("/", protect, authorize("admin"), userController.createUser);

router.get("/", protect, authorize("admin"), userController.getUsers);

router.put("/:id/role",
  protect,
  authorize("admin"),
  userController.updateUserRole
);

router.put("/:id/toggle",
  protect,
  authorize("admin"),
  userController.toggleUserStatus
);

module.exports = router;
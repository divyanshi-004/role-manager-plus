const express = require("express");
const router = express.Router();

const {
  getInventory,
  addInventoryItem,
  restockItem,
  deleteItem,
} = require("../controllers/inventoryController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

/* =========================
   GET INVENTORY
========================= */
router.get(
  "/",
  protect,
  authorize("admin", "manager", "staff"),
  getInventory
);

/* =========================
   ADD INVENTORY ITEM
========================= */
router.post(
  "/",
  protect,
  authorize("admin", "manager", "staff"),
  addInventoryItem
);

/* =========================
   RESTOCK ITEM
========================= */
router.put(
  "/:id/restock",
  protect,
  authorize("admin", "manager", "staff"),
  restockItem
);

/* =========================
   DELETE INVENTORY ITEM
========================= */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteItem
);

module.exports = router; 
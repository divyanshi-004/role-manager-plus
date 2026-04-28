const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Menu = require("../models/Menu");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

/* ==================================
   GET DASHBOARD DATA
================================== */
router.get(
  "/",
  protect,
  authorize("admin", "manager", "staff"),
  async (req, res) => {
    try {
      const orders = await Order.find().populate("items.menuItem");

      /* ================= TOTAL REVENUE ================= */
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.totalAmount || 0);
      }, 0);

      /* ================= ACTIVE ORDERS ================= */
      const activeOrders = orders.filter(
        (o) => o.status !== "served"
      ).length;

      /* ================= TOP SELLING ITEMS ================= */
      const itemMap = {};

      orders.forEach((order) => {
        order.items.forEach((item) => {
          const name = item.menuItem?.name;
          if (!name) return;

          if (!itemMap[name]) {
            itemMap[name] = 0;
          }
          itemMap[name] += item.quantity;
        });
      });

      const topItems = Object.entries(itemMap)
        .map(([name, orders]) => ({ name, orders }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      /* ================= CATEGORY REVENUE ================= */
      const categoryMap = {};

      orders.forEach((order) => {
        order.items.forEach((item) => {
          const menu = item.menuItem;
          if (!menu) return;

          const cat = menu.category || "Other";

          if (!categoryMap[cat]) categoryMap[cat] = 0;

          categoryMap[cat] += item.quantity * menu.price;
        });
      });

      const categoryRevenue = Object.entries(categoryMap).map(
        ([name, value]) => ({ name, value })
      );

      /* ================= RESPONSE ================= */
      res.json({
        totalRevenue,
        activeOrders,
        topItems,
        categoryRevenue,
        totalOrders: orders.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
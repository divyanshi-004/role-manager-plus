const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Menu = require("../models/Menu");
const Inventory = require("../models/Inventory");
const Bill = require("../models/Bill");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

/* ===============================
   CREATE ORDER
================================*/
router.post(
  "/",
  protect,
  authorize("customer", "staff", "manager", "admin"),
  async (req, res) => {
    try {
      const { tableNumber, items } = req.body;

      if (!tableNumber || !items || items.length === 0) {
        return res.status(400).json({
          message: "Invalid order data",
        });
      }

      let totalAmount = 0;

      // fetch menu items
      const menuIds = items.map((i) => i.menuItem);
      const menuItems = await Menu.find({ _id: { $in: menuIds } });

      for (const item of items) {
        const menuItem = menuItems.find(
          (m) => m._id.toString() === item.menuItem
        );

        if (!menuItem)
          return res.status(404).json({
            message: "Menu item not found",
          });

        totalAmount += menuItem.price * item.quantity;
      }

      const order = await Order.create({
        tableNumber,
        items,
        totalAmount,
        status: "pending",
        createdBy: req.user._id,
      });

      res.status(201).json(order);
    } catch (error) {
      console.error("CREATE ORDER ERROR:", error);
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/* ===============================
   GET ORDERS
================================*/
router.get(
  "/",
  protect,
  authorize("customer", "admin", "manager", "staff"),
  async (req, res) => {
    try {
      let query = {};

      // customers see only their orders
      if (req.user.role === "customer") {
        query.createdBy = req.user._id;
      }

      const orders = await Order.find(query)
        .populate("items.menuItem")
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      console.error("GET ORDERS ERROR:", error);
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/* ===============================
   UPDATE ORDER STATUS
   SMART RMS FLOW ⭐
================================*/
router.put(
  "/:id/status",
  protect,
  authorize("staff", "manager", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const validStatus = [
        "pending",
        "preparing",
        "served",
        "paid",
      ];

      if (!status) {
        return res.status(400).json({
          message: "Status required",
        });
      }

      if (!validStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const order = await Order.findById(req.params.id)
        .populate("items.menuItem");

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const alreadyServed = order.status === "served";

      order.status = status;
      await order.save();

      /* ===============================
         INVENTORY DEDUCTION
      ===============================*/
      if (status === "served" && !alreadyServed) {
        for (const item of order.items) {
          const inventoryItem = await Inventory.findOne({
            name: item.menuItem.name,
          });

          if (!inventoryItem) continue;

          inventoryItem.stock = Math.max(
            0,
            inventoryItem.stock - item.quantity
          );

          await inventoryItem.save();
        }

        /* ===============================
           AUTO BILL GENERATION
        ===============================*/
        const existingBill = await Bill.findOne({
          order: order._id,
        });

        if (!existingBill) {
          await Bill.create({
            order: order._id,
            totalAmount: order.totalAmount,
            paymentStatus: "unpaid",
          });
        }
      }

      res.json(order);
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);

      res.status(500).json({
        message: error.message || "Server Error",
      });
    }
  }
);

module.exports = router;
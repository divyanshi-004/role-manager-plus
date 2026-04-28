const express = require("express");
const router = express.Router();

const Bill = require("../models/Bill");
const Order = require("../models/Order");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

/* ==================================
   GENERATE BILL FROM ORDER
================================== */
router.post(
  "/:orderId",
  protect,
  authorize("admin", "manager", "staff"),
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId)
        .populate("items.menuItem");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const existingBill = await Bill.findOne({ order: order._id });

      if (existingBill) {
        return res.status(400).json({
          message: "Bill already exists for this order",
        });
      }

      let total = 0;

      order.items.forEach((item) => {
        if (item.menuItem) {
          total += item.menuItem.price * item.quantity;
        }
      });

      const bill = new Bill({
        order: order._id,
        totalAmount: total,
        paymentStatus: "unpaid",
      });

      await bill.save();

      res.status(201).json(bill);
    } catch (error) {
      console.error("Create Bill Error:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/* ==================================
   GET ALL BILLS
================================== */
router.get(
  "/",
  protect,
  authorize("admin", "manager", "staff"),
  async (req, res) => {
    try {
      const bills = await Bill.find()
        .populate({
          path: "order",
          populate: {
            path: "items.menuItem",
          },
        })
        .sort({ createdAt: -1 });

      res.status(200).json(bills);
    } catch (error) {
      console.error("Get Bills Error:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/* ==================================
   MARK BILL AS PAID
================================== */
router.put(
  "/:id/pay",
  protect,
  authorize("admin", "manager", "staff"),
  async (req, res) => {
    try {
      const bill = await Bill.findById(req.params.id);

      if (!bill) {
        return res.status(404).json({ message: "Bill not found" });
      }

      bill.paymentStatus = "paid";
      await bill.save();

      res.status(200).json({
        message: "Payment successful",
        bill,
      });
    } catch (error) {
      console.error("Mark Paid Error:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
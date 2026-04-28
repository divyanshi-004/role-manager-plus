const Bill = require("../models/Bill");
const Order = require("../models/Order");

/* ===============================
   CREATE BILL FROM ORDER
================================*/
exports.createBill = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const existingBill = await Bill.findOne({ order: orderId });

    if (existingBill) {
      return res.status(400).json({
        message: "Bill already exists for this order",
      });
    }

    const bill = new Bill({
      order: orderId,
      totalAmount: order.totalAmount,
      paymentStatus: "unpaid",
    });

    await bill.save();

    res.status(201).json(bill);
  } catch (err) {
    console.error("Create Bill Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ===============================
   GET ALL BILLS
================================*/
exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("order")
      .sort({ createdAt: -1 });

    res.status(200).json(bills);
  } catch (err) {
    console.error("Get Bills Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ===============================
   MARK AS PAID
================================*/
exports.markAsPaid = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    bill.paymentStatus = "paid";
    await bill.save();

    res.status(200).json(bill);
  } catch (err) {
    console.error("Mark Paid Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
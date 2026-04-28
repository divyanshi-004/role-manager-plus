const Order = require("../models/Order");
const Menu = require("../models/Menu");

// 🟢 CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have items" });
    }

    // Calculate total from Menu prices
    let totalAmount = 0;

    for (let item of items) {
      const menuItem = await Menu.findById(item.menuItem);

      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      totalAmount += menuItem.price * item.quantity;
    }

    const order = new Order({
      tableNumber,
      items,
      totalAmount
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟡 GET ALL ORDERS (FOR ORDERS PAGE UI)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.menuItem") // important for frontend display
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔵 UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated",
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔴 DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
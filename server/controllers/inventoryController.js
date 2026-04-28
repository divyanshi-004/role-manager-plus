const Inventory = require("../models/Inventory");

/* ================================
   GET INVENTORY + SMART ALERTS
================================ */
exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });

    // ✅ Smart Low Stock Prediction
    const enhancedItems = items.map((item) => {
      let alert = null;

      if (item.stock <= item.minStock) {
        alert = `⚠ ${item.name} stock is low`;
      }

      // simple prediction logic (AI-like)
      const predictedDaysLeft =
        item.dailyUsage && item.dailyUsage > 0
          ? Math.floor(item.stock / item.dailyUsage)
          : null;

      if (predictedDaysLeft !== null && predictedDaysLeft <= 1) {
        alert = `⚠ ${item.name} may finish tomorrow`;
      }

      return {
        ...item.toObject(),
        alert,
        predictedDaysLeft,
      };
    });

    res.json(enhancedItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================================
   ADD INVENTORY ITEM
================================ */
exports.addInventoryItem = async (req, res) => {
  try {
    const { name, stock, unit, minStock, category } = req.body;

    if (!name || stock == null) {
      return res.status(400).json({
        message: "Name and stock are required",
      });
    }

    const item = await Inventory.create({
      name,
      stock,
      unit: unit || "pcs",
      minStock: minStock || 5,
      category: category || "general",
      dailyUsage: 0, // ⭐ prediction base
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================================
   RESTOCK ITEM
================================ */
exports.restockItem = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid restock amount",
      });
    }

    const item = await Inventory.findById(req.params.id);

    if (!item)
      return res.status(404).json({ message: "Item not found" });

    item.stock += Number(amount);

    await item.save();

    res.json(item);
  } catch (err) {
    res.status(400).json({ message: "Invalid Inventory ID" });
  }
};

/* ================================
   DELETE ITEM
================================ */
exports.deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item)
      return res.status(404).json({ message: "Item not found" });

    await item.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid Inventory ID" });
  }
};
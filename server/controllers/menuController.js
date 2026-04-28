const Menu = require("../models/Menu");

// 🟢 CREATE MENU ITEM (ADMIN ONLY)
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, availability } = req.body;

    const menuItem = new Menu({
      name,
      description,
      price,
      category,
      availability
    });

    await menuItem.save();

    res.status(201).json({
      message: "Menu item created",
      menuItem
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟡 GET ALL MENU ITEMS (FOR CUSTOMER + ORDERS PAGE)
exports.getAllMenuItems = async (req, res) => {
  try {
    const menu = await Menu.find().sort({ createdAt: -1 });

    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔵 UPDATE MENU ITEM (ADMIN/MANAGER)
exports.updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item updated",
      updatedItem
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔴 DELETE MENU ITEM
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await Menu.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item deleted"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
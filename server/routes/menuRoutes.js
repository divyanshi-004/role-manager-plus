const express = require("express");
const router = express.Router();

const Menu = require("../models/Menu");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

/* ============================
   CREATE MENU ITEM
============================ */
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  async (req, res) => {
    try {
      const { name, description, price, category, availability } = req.body;

      if (!name || !price || !category) {
        return res
          .status(400)
          .json({ message: "Name, price and category are required" });
      }

      const item = await Menu.create({
        name,
        description,
        price,
        category,
        availability: availability ?? true,
      });

      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ============================
   GET ALL MENU ITEMS
============================ */
router.get("/", async (req, res) => {
  try {
    const items = await Menu.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   GET SINGLE MENU ITEM
============================ */
router.get("/:id", async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item)
      return res.status(404).json({ message: "Menu item not found" });

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: "Invalid menu ID" });
  }
});

/* ============================
   UPDATE MENU ITEM
============================ */
router.put(
  "/:id",
  protect,
  authorize("admin", "manager", "staff"),
  async (req, res) => {
    try {
      const updatedItem = await Menu.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedItem)
        return res.status(404).json({ message: "Menu item not found" });

      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  }
);

/* ============================
   DELETE MENU ITEM
============================ */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const item = await Menu.findByIdAndDelete(req.params.id);

      if (!item)
        return res.status(404).json({ message: "Menu item not found" });

      res.json({ message: "Menu item deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid menu ID" });
    }
  }
);

module.exports = router;
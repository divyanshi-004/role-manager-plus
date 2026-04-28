const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
  },

  unit: {
    type: String,
    default: "pcs",
  },

  minStock: {
    type: Number,
    default: 5,
  },

  category: {
    type: String,
    default: "general",
  },

  // ⭐ REQUIRED for smart prediction
  dailyUsage: {
    type: Number,
    default: 0,
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Inventory", InventorySchema);
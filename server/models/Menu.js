const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // ✅ prevents duplicate dishes
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String,
      default: "", // future menu images
    },
  },
  { timestamps: true }
);

/* 🔥 FAST MENU SEARCH */
MenuSchema.index({ name: "text", category: 1 });

module.exports = mongoose.model("Menu", MenuSchema);
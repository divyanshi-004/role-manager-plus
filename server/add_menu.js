const mongoose = require("mongoose");
require("dotenv").config();

const Menu = require("./models/Menu");

const sampleMenu = [
  { name: "Chicken Biryani", description: "Aromatic basmati rice with tender chicken", price: 250, category: "Main Course", availability: true },
  { name: "Paneer Butter Masala", description: "Creamy tomato curry with paneer", price: 200, category: "Main Course", availability: true },
  { name: "Garlic Naan", description: "Soft bread with garlic butter", price: 40, category: "Breads", availability: true },
  { name: "Masala Chai", description: "Spiced tea with milk", price: 30, category: "Beverages", availability: true },
  { name: "Ras Malai", description: "Sweet cheese dumplings in sweetened milk", price: 80, category: "Desserts", availability: true },
  { name: "Samosa", description: "Crispy pastry with spiced potato filling", price: 20, category: "Starters", availability: true },
  { name: "Jeera Rice", description: "Basmati rice with cumin seeds", price: 100, category: "Rice", availability: true },
];

async function addMenuItems() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const item of sampleMenu) {
      const existing = await Menu.findOne({ name: item.name });
      if (!existing) {
        await Menu.create(item);
        console.log(`Added: ${item.name}`);
      } else {
        await Menu.updateOne({ name: item.name }, { availability: true });
        console.log(`Updated: ${item.name}`);
      }
    }

    console.log("Menu items added/updated successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

addMenuItems();
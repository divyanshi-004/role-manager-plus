const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function createUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const users = [
      { name: 'Manager User', email: 'manager@example.com', password: 'manager123', role: 'manager' },
      { name: 'Staff User', email: 'staff@example.com', password: 'staff123', role: 'staff' },
      { name: 'Customer User', email: 'customer@example.com', password: 'customer123', role: 'customer' },
    ];

    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create(userData);
        console.log(`Created: ${userData.email} (${userData.role})`);
      } else {
        console.log(`Skipped: ${userData.email} (already exists)`);
      }
    }

    console.log("Users created successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

createUsers();
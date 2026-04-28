require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const billRoutes = require("./routes/billRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();

/* ======================
   MIDDLEWARES
====================== */

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8080", "http://localhost:8081"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   REQUEST LOGGER
====================== */
app.use((req, res, next) => {
  console.log("API HIT:", req.method, req.originalUrl);
  next();
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rms";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const PORT = process.env.PORT || 5000;

/* ======================
   ROUTES
====================== */

app.use("/api/users", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/inventory", inventoryRoutes);

/* ======================
   DATABASE CONNECTION
====================== */

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

/* ======================
   HEALTH CHECK
====================== */

app.get("/", (req, res) => {
  res.send("🚀 RMS Backend Running");
});

/* ======================
   GLOBAL ERROR HANDLER
====================== */

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ======================
   SERVER START
====================== */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
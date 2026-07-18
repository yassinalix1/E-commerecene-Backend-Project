require("dotenv").config();
const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./db/connect");
const errorHandler = require("./middleware/errorHandler");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const { port } = require("./config/config");

const app = express();

// Parse JSON bodies
app.use(express.json());

// Protect against NoSQL injection
app.use(mongoSanitize({ allowDots: true, replaceWith: "_" }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Welcome to E-Commerce API" });
});

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: "fail", message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    await connectDB();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();

module.exports = app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Sales API is running" });
});

// Placeholder sales routes (will be implemented in later tasks)
app.get("/api/sales/summary", (req, res) => {
  res.json({ totalRevenue: 0, totalQuantity: 0 });
});

app.get("/api/sales/trends", (req, res) => {
  res.json([]);
});

app.get("/api/sales/product-wise", (req, res) => {
  res.json([]);
});

app.get("/api/sales/region-wise", (req, res) => {
  res.json([]);
});

app.get("/api/sales/categories", (req, res) => {
  res.json([]);
});

app.get("/api/sales/regions", (req, res) => {
  res.json([]);
});

app.post("/api/sales/upload", (req, res) => {
  res.status(501).json({ error: "Upload not implemented yet" });
});

// Test DB connection on startup
async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");
  } catch (err) {
    console.warn("PostgreSQL connection failed:", err.message);
    console.log("Ensure PostgreSQL is running: docker-compose up -d");
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();

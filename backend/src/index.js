require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./config/db");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Sales API is running" });
});

app.use("/api", routes);

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");
  } catch (err) {
    console.warn("PostgreSQL connection failed:", err.message);
    console.log("Ensure PostgreSQL is running: docker compose up -d");
  }

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { pool } = require("../src/config/db");
const fs = require("fs");

async function setup() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(
      require("path").join(__dirname, "init.sql"),
      "utf8"
    );
    await client.query(sql);
    console.log("Database schema created successfully (sales table + indexes)");
  } catch (err) {
    console.error("Setup failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();

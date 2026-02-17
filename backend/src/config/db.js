const { Pool } = require("pg");

// Railway / Render provide DATABASE_URL; otherwise use PG_* or defaults
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
    : {
        host: process.env.PG_HOST || "localhost",
        port: parseInt(process.env.PG_PORT || "5432", 10),
        database: process.env.PG_DATABASE || "dyne_sales",
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASSWORD || "postgres",
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

pool.on("error", (err) => {
  console.error("Unexpected pool error:", err);
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

module.exports = { pool, query };

const { query } = require("../config/db");

function parseFilters(req) {
  const { startDate, endDate, category, region } = req.query;
  const cat = category && String(category).trim() ? category.trim() : null;
  const reg = region && String(region).trim() ? region.trim() : null;
  return { startDate, endDate, category: cat, region: reg };
}

function whereClause(includeDate = true) {
  let sql = " WHERE 1=1 ";
  const params = [];
  let i = 1;
  if (includeDate) {
    sql += ` AND order_date >= $${i}::date AND order_date <= $${i + 1}::date `;
    i += 2;
  }
  sql += ` AND ($${i}::text IS NULL OR $${i} = '' OR category = $${i}) `;
  sql += ` AND ($${i + 1}::text IS NULL OR $${i + 1} = '' OR region = $${i + 1}) `;
  return { sql, paramCount: i + 1 };
}

async function getSummary(req, res) {
  try {
    const { startDate, endDate, category, region } = parseFilters(req);
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }
    const { sql: where, paramCount } = whereClause(true);
    const result = await query(
      `SELECT
        COALESCE(SUM(total_amount), 0)::numeric as total_revenue,
        COALESCE(SUM(quantity), 0)::bigint as total_quantity
       FROM sales ${where}`,
      [startDate, endDate, category, region]
    );
    const row = result.rows[0] || {};
    return res.json({
      totalRevenue: parseFloat(row.total_revenue || 0),
      totalQuantity: parseInt(row.total_quantity || 0, 10),
    });
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
}

async function getTrends(req, res) {
  try {
    const { startDate, endDate, category, region } = parseFilters(req);
    const type = (req.query.type || "daily").toLowerCase();
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }
    let dateExpr;
    if (type === "weekly") {
      dateExpr = "date_trunc('week', order_date)::date";
    } else if (type === "monthly") {
      dateExpr = "date_trunc('month', order_date)::date";
    } else {
      dateExpr = "order_date";
    }
    const { sql: where } = whereClause(true);
    const result = await query(
      `SELECT ${dateExpr} as date, COALESCE(SUM(total_amount), 0)::numeric as revenue
       FROM sales ${where}
       GROUP BY ${dateExpr}
       ORDER BY date`,
      [startDate, endDate, category, region]
    );
    const data = result.rows.map((r) => ({
      date: r.date ? (r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date)) : null,
      revenue: parseFloat(r.revenue || 0),
    }));
    return res.json(data);
  } catch (err) {
    console.error("getTrends error:", err);
    return res.status(500).json({ error: "Failed to fetch trends" });
  }
}

async function getProductWise(req, res) {
  try {
    const { startDate, endDate, category, region } = parseFilters(req);
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }
    const { sql: where } = whereClause(true);
    const result = await query(
      `SELECT product_name, COALESCE(SUM(total_amount), 0)::numeric as revenue
       FROM sales ${where}
       GROUP BY product_name
       ORDER BY revenue DESC`,
      [startDate, endDate, category, region]
    );
    const data = result.rows.map((r) => ({
      product_name: r.product_name,
      product: r.product_name,
      revenue: parseFloat(r.revenue || 0),
    }));
    return res.json(data);
  } catch (err) {
    console.error("getProductWise error:", err);
    return res.status(500).json({ error: "Failed to fetch product-wise data" });
  }
}

async function getRegionWise(req, res) {
  try {
    const { startDate, endDate, category, region } = parseFilters(req);
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }
    const { sql: where } = whereClause(true);
    const result = await query(
      `SELECT region, COALESCE(SUM(total_amount), 0)::numeric as revenue
       FROM sales ${where}
       GROUP BY region
       ORDER BY revenue DESC`,
      [startDate, endDate, category, region]
    );
    const data = result.rows.map((r) => ({
      region: r.region || "Other",
      revenue: parseFloat(r.revenue || 0),
    }));
    return res.json(data);
  } catch (err) {
    console.error("getRegionWise error:", err);
    return res.status(500).json({ error: "Failed to fetch region-wise data" });
  }
}

async function getCategories(req, res) {
  try {
    const result = await query(
      `SELECT DISTINCT TRIM(category) AS category FROM sales
       WHERE category IS NOT NULL AND TRIM(category) != ''
       ORDER BY category`
    );
    const list = result.rows.map((r) => (r.category || "").trim()).filter((c) => c.length > 0);
    return res.json([...new Set(list)]);
  } catch (err) {
    console.error("getCategories error:", err);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}

async function getRegions(req, res) {
  try {
    const result = await query(
      `SELECT DISTINCT TRIM(region) AS region FROM sales
       WHERE region IS NOT NULL AND TRIM(region) != ''
       ORDER BY region`
    );
    const list = result.rows.map((r) => (r.region || "").trim()).filter((r) => r.length > 0);
    return res.json([...new Set(list)]);
  } catch (err) {
    console.error("getRegions error:", err);
    return res.status(500).json({ error: "Failed to fetch regions" });
  }
}

module.exports = {
  getSummary,
  getTrends,
  getProductWise,
  getRegionWise,
  getCategories,
  getRegions,
};

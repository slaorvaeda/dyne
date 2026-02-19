const { query } = require("../config/db");

// Normalize category to first segment (e.g. "Computers&Accessories|..." -> "Computers&Accessories")
const CATEGORY_EXPR = "COALESCE(NULLIF(TRIM(SPLIT_PART(category, '|', 1)), ''), category)";

function parseQuery(req) {
  const category = req.query.category ? String(req.query.category).trim() : null;
  const ratingMin = req.query.ratingMin != null ? parseFloat(req.query.ratingMin) : null;
  const ratingMax = req.query.ratingMax != null ? parseFloat(req.query.ratingMax) : null;
  const search = req.query.search ? String(req.query.search).trim() : null;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  return { category, ratingMin, ratingMax, search, page, limit };
}

function buildWhere(params) {
  const conditions = [];
  const values = [];
  let i = 1;
  if (params.category) {
    conditions.push(`${CATEGORY_EXPR} = $${i}`);
    values.push(params.category);
    i++;
  }
  if (params.ratingMin != null && !isNaN(params.ratingMin)) {
    conditions.push(`rating >= $${i}`);
    values.push(params.ratingMin);
    i++;
  }
  if (params.ratingMax != null && !isNaN(params.ratingMax)) {
    conditions.push(`rating <= $${i}`);
    values.push(params.ratingMax);
    i++;
  }
  if (params.search) {
    conditions.push(`product_name ILIKE $${i}`);
    values.push(`%${params.search}%`);
    i++;
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return { where, values, nextIndex: i };
}

async function getProductsPerCategory(req, res) {
  try {
    const { where, values } = buildWhere(parseQuery(req));
    const sql = `
      SELECT ${CATEGORY_EXPR} AS category, COUNT(*)::int AS count
      FROM product_reviews
      ${where}
      GROUP BY ${CATEGORY_EXPR}
      HAVING ${CATEGORY_EXPR} IS NOT NULL AND ${CATEGORY_EXPR} != ''
      ORDER BY count DESC
    `;
    const result = await query(sql, values);
    return res.json(result.rows);
  } catch (err) {
    console.error("getProductsPerCategory:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

async function getTopReviewed(req, res) {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const { where, values } = buildWhere(parseQuery(req));
    values.push(limit);
    const sql = `
      SELECT product_name AS name, COALESCE(rating_count, 0)::int AS review_count
      FROM product_reviews
      ${where}
      GROUP BY product_id, product_name, rating_count
      ORDER BY review_count DESC
      LIMIT $${values.length}
    `;
    const result = await query(sql, values);
    return res.json(result.rows);
  } catch (err) {
    console.error("getTopReviewed:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

async function getDiscountDistribution(req, res) {
  try {
    const { where, values } = buildWhere(parseQuery(req));
    // discount_percentage in data can be 0.64 (64%) or 64; bucket 0-10, 10-20, ... 90-100
    const sql = `
      WITH t AS (
        SELECT CASE
          WHEN (CASE WHEN COALESCE(discount_percentage, 0) <= 1 THEN discount_percentage * 100 ELSE discount_percentage END) < 10 THEN '0-10%'
          WHEN (CASE WHEN COALESCE(discount_percentage, 0) <= 1 THEN discount_percentage * 100 ELSE discount_percentage END) < 20 THEN '10-20%'
          WHEN (CASE WHEN COALESCE(discount_percentage, 0) <= 1 THEN discount_percentage * 100 ELSE discount_percentage END) < 30 THEN '20-30%'
          WHEN (CASE WHEN COALESCE(discount_percentage, 0) <= 1 THEN discount_percentage * 100 ELSE discount_percentage END) < 40 THEN '30-40%'
          WHEN (CASE WHEN COALESCE(discount_percentage, 0) <= 1 THEN discount_percentage * 100 ELSE discount_percentage END) < 50 THEN '40-50%'
          WHEN (CASE WHEN COALESCE(discount_percentage, 0) <= 1 THEN discount_percentage * 100 ELSE discount_percentage END) < 60 THEN '50-60%'
          WHEN (CASE WHEN COALESCE(discount_percentage, 0) <= 1 THEN discount_percentage * 100 ELSE discount_percentage END) < 70 THEN '60-70%'
          WHEN (CASE WHEN COALESCE(discount_percentage, 0) <= 1 THEN discount_percentage * 100 ELSE discount_percentage END) < 80 THEN '70-80%'
          WHEN (CASE WHEN COALESCE(discount_percentage, 0) <= 1 THEN discount_percentage * 100 ELSE discount_percentage END) < 90 THEN '80-90%'
          ELSE '90-100%'
        END AS bucket
        FROM product_reviews
        ${where}
      )
      SELECT bucket, COUNT(*)::int AS count
      FROM t
      GROUP BY bucket
      ORDER BY MIN(CASE bucket
        WHEN '0-10%' THEN 1 WHEN '10-20%' THEN 2 WHEN '20-30%' THEN 3 WHEN '30-40%' THEN 4
        WHEN '40-50%' THEN 5 WHEN '50-60%' THEN 6 WHEN '60-70%' THEN 7 WHEN '70-80%' THEN 8
        WHEN '80-90%' THEN 9 ELSE 10 END)
    `;
    const result = await query(sql, values);
    return res.json(result.rows);
  } catch (err) {
    console.error("getDiscountDistribution:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

async function getCategoryAvgRating(req, res) {
  try {
    const { where, values } = buildWhere(parseQuery(req));
    const sql = `
      SELECT ${CATEGORY_EXPR} AS category, ROUND(AVG(rating)::numeric, 2) AS avg_rating
      FROM product_reviews
      ${where}
      GROUP BY ${CATEGORY_EXPR}
      HAVING ${CATEGORY_EXPR} IS NOT NULL AND ${CATEGORY_EXPR} != '' AND AVG(rating) IS NOT NULL
      ORDER BY avg_rating DESC
    `;
    const result = await query(sql, values);
    return res.json(result.rows);
  } catch (err) {
    console.error("getCategoryAvgRating:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

async function getList(req, res) {
  try {
    const { category, ratingMin, ratingMax, search, page, limit } = parseQuery(req);
    const { where, values } = buildWhere({ category, ratingMin, ratingMax, search });
    const offset = (page - 1) * limit;

    const countSql = `SELECT COUNT(*)::int AS total FROM product_reviews ${where}`;
    const countResult = await query(countSql, values);
    const total = parseInt(countResult.rows[0]?.total || 0, 10);

    values.push(limit, offset);
    const listSql = `
      SELECT id, product_id, product_name, ${CATEGORY_EXPR} AS category,
             discounted_price, actual_price, discount_percentage, rating, rating_count,
             LEFT(review_content, 200) AS review_preview
      FROM product_reviews
      ${where}
      ORDER BY rating_count DESC NULLS LAST, id
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;
    const listResult = await query(listSql, values);
    return res.json({
      data: listResult.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("getList:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

async function getFilters(req, res) {
  try {
    const categoriesResult = await query(
      `SELECT DISTINCT ${CATEGORY_EXPR} AS category FROM product_reviews WHERE ${CATEGORY_EXPR} IS NOT NULL AND ${CATEGORY_EXPR} != '' ORDER BY 1`
    );
    const ratingsResult = await query(
      `SELECT DISTINCT ROUND(rating::numeric, 1) AS rating FROM product_reviews WHERE rating IS NOT NULL ORDER BY 1`
    );
    return res.json({
      categories: (categoriesResult.rows || []).map((r) => r.category),
      ratings: (ratingsResult.rows || []).map((r) => Number(r.rating)),
    });
  } catch (err) {
    console.error("getFilters:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

module.exports = {
  getProductsPerCategory,
  getTopReviewed,
  getDiscountDistribution,
  getCategoryAvgRating,
  getList,
  getFilters,
};

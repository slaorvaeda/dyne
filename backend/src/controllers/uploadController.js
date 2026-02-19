const XLSX = require("xlsx");
const { query } = require("../config/db");

const COLUMN_MAP = {
  order_date: ["order_date", "orderdate", "date", "order date"],
  product_name: ["product_name", "productname", "product", "product name"],
  category: ["category", "categories"],
  region: ["region", "regions"],
  quantity: ["quantity", "qty", "qty_sold"],
  price: ["price", "unit_price", "unit price", "discounted_price", "actual_price"],
  total_amount: ["total_amount", "totalamount", "total", "total amount", "revenue", "amount", "discounted_price", "actual_price"],
};

function normalizeKey(s) {
  if (typeof s !== "string") return "";
  return s.toLowerCase().trim().replace(/\s+/g, "_");
}

function findColumn(headers, aliases) {
  const normalized = headers.map((h) => ({ orig: h, key: normalizeKey(h) }));
  for (const alias of aliases) {
    const a = normalizeKey(alias);
    const found = normalized.find((n) => n.key === a || n.key.replace(/_/g, "") === a.replace(/_/g, ""));
    if (found) return found.orig;
  }
  return null;
}

function parseFile(buffer, ext) {
  const rows = [];
  if (ext === "csv") {
    const text = buffer.toString("utf-8");
    const wb = XLSX.read(text, { type: "string", raw: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    if (json.length < 2) return rows;
    const headers = json[0].map((h) => String(h || "").trim());
    for (let i = 1; i < json.length; i++) {
      const row = {};
      json[i].forEach((v, j) => {
        row[headers[j] || `col_${j}`] = v;
      });
      rows.push(row);
    }
  } else {
    const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
    rows.push(...json);
  }
  return rows;
}

function mapRow(raw, colMap) {
  const get = (key) => {
    const c = colMap[key];
    if (!c) return null;
    let v = raw[c];
    if (v === undefined || v === null || v === "") return null;
    if (typeof v === "object" && v instanceof Date) return v.toISOString().slice(0, 10);
    return String(v).trim();
  };
  const getNum = (key) => {
    const v = get(key);
    if (v === null || v === "") return null;
    const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
    return isNaN(n) ? null : n;
  };
  const getInt = (key) => {
    const n = getNum(key);
    return n === null ? null : Math.floor(n);
  };
  const orderDate = get("order_date");
  const productName = get("product_name");
  const price = getNum("price");
  const totalAmount = getNum("total_amount");
  if (!orderDate || !productName || price == null || totalAmount == null) return null;
  let orderDateStr = orderDate;
  if (orderDateStr.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(orderDateStr)) {
    // already YYYY-MM-DD
  } else {
    const d = new Date(orderDateStr);
    if (isNaN(d.getTime())) return null;
    orderDateStr = d.toISOString().slice(0, 10);
  }
  return {
    order_date: orderDateStr,
    product_name: productName,
    category: get("category") || null,
    region: get("region") || null,
    quantity: getInt("quantity") ?? 1,
    price: Math.round(price * 100) / 100,
    total_amount: Math.round(totalAmount * 100) / 100,
  };
}

function randomDate(start, end) {
  const t = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(t).toISOString().slice(0, 10);
}

function mapRowWithSyntheticDate(raw, colMap, dateStart, dateEnd) {
  const get = (key) => {
    const c = colMap[key];
    if (!c) return null;
    let v = raw[c];
    if (v === undefined || v === null || v === "") return null;
    if (typeof v === "object" && v instanceof Date) return v.toISOString().slice(0, 10);
    return String(v).trim();
  };
  const getNum = (key) => {
    const v = get(key);
    if (v === null || v === "") return null;
    const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
    return isNaN(n) ? null : n;
  };
  const productName = get("product_name");
  if (!productName) return null;
  const price = getNum("price") ?? getNum("total_amount");
  if (price == null || price <= 0) return null;
  const amount = Math.round(price * 100) / 100;
  let category = get("category");
  if (category && category.includes("|")) category = category.split("|")[0].trim() || null;
  return {
    order_date: randomDate(dateStart, dateEnd),
    product_name: productName.slice(0, 255),
    category: category ? category.slice(0, 100) : null,
    region: get("region") || "Online",
    quantity: 1,
    price: amount,
    total_amount: amount,
  };
}

async function uploadSales(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const ext = (req.file.originalname || "").toLowerCase().replace(/.*\./, "");
    if (!["csv", "xlsx", "xls"].includes(ext)) {
      return res.status(400).json({ error: "Only CSV, XLSX, and XLS files are allowed" });
    }
    const rawRows = parseFile(req.file.buffer, ext);
    if (rawRows.length === 0) {
      return res.status(400).json({ error: "File is empty or has no data rows" });
    }
    const headers = Object.keys(rawRows[0] || {});
    const colMap = {};
    for (const [dbCol, aliases] of Object.entries(COLUMN_MAP)) {
      const found = findColumn(headers, aliases);
      if (found) colMap[dbCol] = found;
    }

    const hasRequired = colMap.product_name && (colMap.price || colMap.total_amount);
    const hasDate = colMap.order_date;
    const useSyntheticDate = hasRequired && !hasDate;

    if (!hasRequired) {
      return res.status(400).json({
        error: "File must contain product_name (or product) and either price or total_amount (or discounted_price). Found columns: " + headers.join(", "),
      });
    }

    const rows = [];
    const dateEnd = new Date();
    const dateStart = new Date(dateEnd);
    dateStart.setFullYear(dateStart.getFullYear() - 1);

    for (const raw of rawRows) {
      const row = useSyntheticDate
        ? mapRowWithSyntheticDate(raw, colMap, dateStart, dateEnd)
        : mapRow(raw, colMap);
      if (row) rows.push(row);
    }
    if (rows.length === 0) {
      return res.status(400).json({ error: "No valid rows found. Check product_name, price/total_amount/discounted_price format." });
    }

    const replace = req.body && (req.body.replace === "true" || req.body.replace === true);
    if (replace) {
      await query("TRUNCATE TABLE sales RESTART IDENTITY");
    }

    let inserted = 0;
    for (const row of rows) {
      await query(
        `INSERT INTO sales (order_date, product_name, category, region, quantity, price, total_amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [row.order_date, row.product_name, row.category, row.region, row.quantity, row.price, row.total_amount]
      );
      inserted++;
    }
    return res.json({ recordsInserted: inserted, replaced: replace });
  } catch (err) {
    console.error("uploadSales error:", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}

function mapRowRatings(raw) {
  const get = (key) => {
    const v = raw[key];
    if (v === undefined || v === null || v === "") return null;
    if (typeof v === "object" && v instanceof Date) return v.toISOString().slice(0, 10);
    return String(v).trim();
  };
  const getNum = (key) => {
    const v = raw[key];
    if (v === undefined || v === null || v === "") return null;
    const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
    return isNaN(n) ? null : n;
  };
  const getInt = (key) => {
    const n = getNum(key);
    return n === null ? null : Math.floor(n);
  };
  const productName = get("product_name");
  if (!productName) return null;
  let category = get("category");
  if (category && category.includes("|")) category = category.split("|")[0].trim() || category;
  return {
    product_id: (get("product_id") || "").slice(0, 100),
    product_name: productName.slice(0, 500),
    category: category ? category.slice(0, 200) : null,
    discounted_price: getNum("discounted_price"),
    actual_price: getNum("actual_price"),
    discount_percentage: getNum("discount_percentage"),
    rating: getNum("rating"),
    rating_count: getInt("rating_count"),
    about_product: (get("about_product") || "").slice(0, 5000),
    user_name: (get("user_name") || "").slice(0, 500),
    review_title: (get("review_title") || "").slice(0, 1000),
    review_content: (get("review_content") || "").slice(0, 5000),
  };
}

function isRatingsFormat(headers) {
  const lower = headers.map((h) => String(h).toLowerCase().replace(/\s+/g, "_"));
  return (
    (lower.includes("product_id") || lower.includes("product_name")) &&
    (lower.includes("rating") || lower.includes("rating_count")) &&
    (lower.includes("category") || lower.includes("categories"))
  );
}

function normalizeHeaders(rawRow) {
  const out = {};
  for (const [k, v] of Object.entries(rawRow || {})) {
    const key = String(k).toLowerCase().trim().replace(/\s+/g, "_");
    out[key] = v;
  }
  return out;
}

async function uploadRatings(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const ext = (req.file.originalname || "").toLowerCase().replace(/.*\./, "");
    if (!["csv", "xlsx", "xls"].includes(ext)) {
      return res.status(400).json({ error: "Only CSV, XLSX, and XLS files are allowed" });
    }
    const rawRows = parseFile(req.file.buffer, ext);
    if (rawRows.length === 0) {
      return res.status(400).json({ error: "File is empty or has no data rows" });
    }
    const headers = Object.keys(rawRows[0] || {});
    if (!isRatingsFormat(headers)) {
      return res.status(400).json({
        error: "File must contain product_name (or product_id), category, and rating (or rating_count). Columns: " + headers.join(", "),
      });
    }

    const rows = [];
    for (const raw of rawRows) {
      const normalized = normalizeHeaders(raw);
      const row = mapRowRatings(normalized);
      if (row) rows.push(row);
    }
    if (rows.length === 0) {
      return res.status(400).json({ error: "No valid rows found. Need product_name and at least category." });
    }

    const replace = req.body && (req.body.replace === "true" || req.body.replace === true);
    if (replace) {
      await query("TRUNCATE TABLE product_reviews RESTART IDENTITY");
    }

    let inserted = 0;
    for (const row of rows) {
      await query(
        `INSERT INTO product_reviews (product_id, product_name, category, discounted_price, actual_price, discount_percentage, rating, rating_count, about_product, user_name, review_title, review_content)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          row.product_id || null,
          row.product_name,
          row.category,
          row.discounted_price,
          row.actual_price,
          row.discount_percentage,
          row.rating,
          row.rating_count,
          row.about_product || null,
          row.user_name || null,
          row.review_title || null,
          row.review_content || null,
        ]
      );
      inserted++;
    }
    return res.json({ recordsInserted: inserted, replaced: replace });
  } catch (err) {
    console.error("uploadRatings error:", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}

module.exports = { uploadSales, uploadRatings };

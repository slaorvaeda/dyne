const XLSX = require("xlsx");
const { query } = require("../config/db");

const COLUMN_MAP = {
  order_date: ["order_date", "orderdate", "date", "order date"],
  product_name: ["product_name", "productname", "product", "product name"],
  category: ["category", "categories"],
  region: ["region", "regions"],
  quantity: ["quantity", "qty", "qty_sold"],
  price: ["price", "unit_price", "unit price"],
  total_amount: ["total_amount", "totalamount", "total", "total amount", "revenue", "amount"],
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

async function uploadSales(req, res) {
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
  if (!colMap.order_date || !colMap.product_name || !colMap.price || !colMap.total_amount) {
    return res.status(400).json({
      error: "File must contain order_date/date, product_name/product, price, and total_amount/total columns",
    });
  }
  const rows = [];
  for (const raw of rawRows) {
    const row = mapRow(raw, colMap);
    if (row) rows.push(row);
  }
  if (rows.length === 0) {
    return res.status(400).json({ error: "No valid rows found. Check date, product, price, and total_amount format." });
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
  return res.json({ recordsInserted: inserted });
}

module.exports = { uploadSales };

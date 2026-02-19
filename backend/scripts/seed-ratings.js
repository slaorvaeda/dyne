require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const XLSX = require("xlsx");
const { query } = require("../src/config/db");

const DATASET_PATH = require("path").join(__dirname, "..", "..", "Dataset.xlsx");

function get(raw, key) {
  const v = raw[key];
  if (v === undefined || v === null || v === "") return null;
  return String(v).trim();
}
function getNum(raw, key) {
  const v = raw[key];
  if (v === undefined || v === null || v === "") return null;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? null : n;
}
function getInt(raw, key) {
  const n = getNum(raw, key);
  return n === null ? null : Math.floor(n);
}

async function seed() {
  let wb;
  try {
    wb = XLSX.readFile(DATASET_PATH, { type: "file", cellDates: true });
  } catch (e) {
    console.error("Could not read Dataset.xlsx at", DATASET_PATH, e.message);
    process.exit(1);
  }
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
  if (rows.length === 0) {
    console.error("No rows in sheet");
    process.exit(1);
  }

  await query("TRUNCATE TABLE product_reviews RESTART IDENTITY");

  let inserted = 0;
  for (const raw of rows) {
    const productName = get(raw, "product_name");
    if (!productName) continue;
    let category = get(raw, "category");
    if (category && category.includes("|")) category = category.split("|")[0].trim() || category;

    await query(
      `INSERT INTO product_reviews (product_id, product_name, category, discounted_price, actual_price, discount_percentage, rating, rating_count, about_product, user_name, review_title, review_content)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        (get(raw, "product_id") || "").slice(0, 100),
        productName.slice(0, 500),
        category ? category.slice(0, 200) : null,
        getNum(raw, "discounted_price"),
        getNum(raw, "actual_price"),
        getNum(raw, "discount_percentage"),
        getNum(raw, "rating"),
        getInt(raw, "rating_count"),
        (get(raw, "about_product") || "").slice(0, 5000),
        (get(raw, "user_name") || "").slice(0, 500),
        (get(raw, "review_title") || "").slice(0, 1000),
        (get(raw, "review_content") || "").slice(0, 5000),
      ]
    );
    inserted++;
    if (inserted % 200 === 0) process.stdout.write(".");
  }
  console.log("\nDone. product_reviews seeded:", inserted);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

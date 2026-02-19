require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const XLSX = require("xlsx");
const { query } = require("../src/config/db");

const DATASET_PATH = require("path").join(__dirname, "..", "..", "Dataset.xlsx");

function randomDateBetween(start, end) {
  const t = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(t);
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
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

  const end = new Date();
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);

  const toInsert = [];
  for (const raw of rows) {
    const productName = raw.product_name != null ? String(raw.product_name).trim() : "";
    const categoryRaw = raw.category != null ? String(raw.category).trim() : "";
    const category = categoryRaw.split("|")[0] || null;
    const discountedPrice = raw.discounted_price != null ? parseFloat(String(raw.discounted_price).replace(/[^0-9.-]/g, "")) : NaN;
    if (!productName || isNaN(discountedPrice) || discountedPrice <= 0) continue;

    const orderDate = formatDate(randomDateBetween(start, end));
    const price = Math.round(discountedPrice * 100) / 100;
    const totalAmount = price;
    const region = "Online";

    toInsert.push({
      order_date: orderDate,
      product_name: productName.slice(0, 255),
      category: category ? category.slice(0, 100) : null,
      region,
      quantity: 1,
      price,
      total_amount: totalAmount,
    });
  }

  if (toInsert.length === 0) {
    console.error("No valid rows to insert (need product_name and discounted_price)");
    process.exit(1);
  }

  console.log("Inserting", toInsert.length, "rows from Dataset.xlsx ...");

  let inserted = 0;
  for (const row of toInsert) {
    await query(
      `INSERT INTO sales (order_date, product_name, category, region, quantity, price, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [row.order_date, row.product_name, row.category, row.region, row.quantity, row.price, row.total_amount]
    );
    inserted++;
    if (inserted % 500 === 0) process.stdout.write(".");
  }

  console.log("\nDone. Records inserted:", inserted);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

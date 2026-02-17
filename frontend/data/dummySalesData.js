// dummy data for charts when API is down

const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"];
const regions = ["North", "South", "East", "West", "Central"];
const products = [
  "Laptop Pro 15",
  "Wireless Headphones",
  "Smart Watch",
  "Running Shoes",
  "Desk Lamp",
  "Coffee Maker",
  "Yoga Mat",
  "Bluetooth Speaker",
  "Office Chair",
  "Water Bottle",
];

// last 30 days
const lastNDays = 30;
const trendDates = Array.from({ length: lastNDays }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (lastNDays - 1 - i));
  return d.toISOString().slice(0, 10);
});

export const dummySummary = {
  totalRevenue: 2847500,
  totalQuantity: 12450,
};

export const dummyTrends = trendDates.map((date, i) => ({
  date,
  revenue: Math.round(60000 + Math.sin(i / 3) * 25000 + Math.random() * 20000),
}));

export const dummyProductWise = products.map((name, i) => ({
  product_name: name,
  product: name,
  revenue: Math.round(80000 + Math.random() * 350000),
}));

export const dummyRegionWise = regions.map((region, i) => ({
  region,
  revenue: [520000, 480000, 610000, 450000, 387500][i] || 400000,
}));

export const dummyFilters = {
  categories,
  regions,
};

export default {
  summary: dummySummary,
  trends: dummyTrends,
  productWise: dummyProductWise,
  regionWise: dummyRegionWise,
  filters: dummyFilters,
};

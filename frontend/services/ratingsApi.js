import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export async function uploadRatingsFile(file, options = {}) {
  const formData = new FormData();
  formData.append("file", file);
  if (options.replace) {
    formData.append("replace", "true");
  }
  const { data } = await api.post("/ratings/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getProductsPerCategory(params = {}) {
  const { data } = await api.get("/ratings/products-per-category", { params });
  return data;
}

export async function getTopReviewed(params = {}) {
  const { data } = await api.get("/ratings/top-reviewed", { params });
  return data;
}

export async function getDiscountDistribution(params = {}) {
  const { data } = await api.get("/ratings/discount-distribution", { params });
  return data;
}

export async function getCategoryAvgRating(params = {}) {
  const { data } = await api.get("/ratings/category-avg-rating", { params });
  return data;
}

export async function getRatingsList(params = {}) {
  const { data } = await api.get("/ratings/list", { params });
  return data;
}

export async function getRatingsFilters() {
  const { data } = await api.get("/ratings/filters");
  return data;
}

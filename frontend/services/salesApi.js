import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export async function uploadSalesFile(file, options = {}) {
  const formData = new FormData();
  formData.append("file", file);
  if (options.replace) {
    formData.append("replace", "true");
  }
  const { data } = await api.post("/sales/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getSummary(params = {}) {
  const { data } = await api.get("/sales/summary", { params });
  return data;
}

export async function getTrends(params = {}) {
  const { data } = await api.get("/sales/trends", { params });
  return data;
}

export async function getProductWise(params = {}) {
  const { data } = await api.get("/sales/product-wise", { params });
  return data;
}

export async function getRegionWise(params = {}) {
  const { data } = await api.get("/sales/region-wise", { params });
  return data;
}

export async function getCategoryWise(params = {}) {
  const { data } = await api.get("/sales/category-wise", { params });
  return data;
}

export async function getSales(params = {}) {
  const { data } = await api.get("/sales", { params });
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/sales/categories");
  return Array.isArray(data) ? data : [];
}

export async function getRegions() {
  const { data } = await api.get("/sales/regions");
  return Array.isArray(data) ? data : [];
}

export default api;

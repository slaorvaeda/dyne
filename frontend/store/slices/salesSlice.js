"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as salesApi from "@/services/salesApi";

export const uploadSales = createAsyncThunk(
  "sales/upload",
  async (payload, { rejectWithValue }) => {
    try {
      const file = typeof payload === "object" && payload?.file != null ? payload.file : payload;
      const replace = typeof payload === "object" && payload?.replace === true;
      const data = await salesApi.uploadSalesFile(file, { replace });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Upload failed");
    }
  }
);

export const fetchSummary = createAsyncThunk(
  "sales/fetchSummary",
  async (params, { rejectWithValue }) => {
    try {
      const data = await salesApi.getSummary(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

export const fetchTrends = createAsyncThunk(
  "sales/fetchTrends",
  async (params, { rejectWithValue }) => {
    try {
      const data = await salesApi.getTrends(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

export const fetchProductWise = createAsyncThunk(
  "sales/fetchProductWise",
  async (params, { rejectWithValue }) => {
    try {
      const data = await salesApi.getProductWise(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

export const fetchRegionWise = createAsyncThunk(
  "sales/fetchRegionWise",
  async (params, { rejectWithValue }) => {
    try {
      const data = await salesApi.getRegionWise(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

export const fetchCategoryWise = createAsyncThunk(
  "sales/fetchCategoryWise",
  async (params, { rejectWithValue }) => {
    try {
      const data = await salesApi.getCategoryWise(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

export const fetchFilters = createAsyncThunk(
  "sales/fetchFilters",
  async (_, { rejectWithValue }) => {
    try {
      const [categories, regions] = await Promise.all([
        salesApi.getCategories(),
        salesApi.getRegions(),
      ]);
      return { categories: categories || [], regions: regions || [] };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

const initialState = {
  summary: { totalRevenue: 0, totalQuantity: 0 },
  trends: [],
  productWise: [],
  regionWise: [],
  categoryWise: [],
  filters: { categories: [], regions: [] },
  upload: { recordsInserted: null, error: null, replaced: false },
  loading: {
    summary: false,
    trends: false,
    productWise: false,
    regionWise: false,
    categoryWise: false,
    upload: false,
    filters: false,
  },
  error: null,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearUploadResult: (state) => {
      state.upload = { recordsInserted: null, error: null, replaced: false };
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, { payload }) => {
      state.error = payload != null ? String(payload) : null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadSales.pending, (state) => {
      state.loading.upload = true;
      state.upload = { recordsInserted: null, error: null, replaced: false };
    });
    builder.addCase(uploadSales.fulfilled, (state, { payload }) => {
      state.loading.upload = false;
      state.upload = {
        recordsInserted: payload?.recordsInserted ?? payload ?? null,
        error: null,
        replaced: payload?.replaced ?? false,
      };
    });
    builder.addCase(uploadSales.rejected, (state, { payload }) => {
      state.loading.upload = false;
      state.upload = { recordsInserted: null, error: payload || "Upload failed", replaced: false };
    });
    builder.addCase(fetchSummary.pending, (state) => {
      state.loading.summary = true;
      state.error = null;
    });
    builder.addCase(fetchSummary.fulfilled, (state, { payload }) => {
      state.loading.summary = false;
      state.summary = payload || initialState.summary;
    });
    builder.addCase(fetchSummary.rejected, (state, { payload }) => {
      state.loading.summary = false;
      state.error = payload;
    });
    builder.addCase(fetchTrends.pending, (state) => {
      state.loading.trends = true;
      state.error = null;
    });
    builder.addCase(fetchTrends.fulfilled, (state, { payload }) => {
      state.loading.trends = false;
      state.trends = Array.isArray(payload) ? payload : [];
    });
    builder.addCase(fetchTrends.rejected, (state, { payload }) => {
      state.loading.trends = false;
      state.trends = [];
      state.error = payload;
    });
    builder.addCase(fetchProductWise.pending, (state) => {
      state.loading.productWise = true;
      state.error = null;
    });
    builder.addCase(fetchProductWise.fulfilled, (state, { payload }) => {
      state.loading.productWise = false;
      state.productWise = Array.isArray(payload) ? payload : [];
    });
    builder.addCase(fetchProductWise.rejected, (state, { payload }) => {
      state.loading.productWise = false;
      state.productWise = [];
      state.error = payload;
    });
    builder.addCase(fetchRegionWise.pending, (state) => {
      state.loading.regionWise = true;
      state.error = null;
    });
    builder.addCase(fetchRegionWise.fulfilled, (state, { payload }) => {
      state.loading.regionWise = false;
      state.regionWise = Array.isArray(payload) ? payload : [];
    });
    builder.addCase(fetchRegionWise.rejected, (state, { payload }) => {
      state.loading.regionWise = false;
      state.regionWise = [];
      state.error = payload;
    });
    builder.addCase(fetchCategoryWise.pending, (state) => {
      state.loading.categoryWise = true;
      state.error = null;
    });
    builder.addCase(fetchCategoryWise.fulfilled, (state, { payload }) => {
      state.loading.categoryWise = false;
      state.categoryWise = Array.isArray(payload) ? payload : [];
    });
    builder.addCase(fetchCategoryWise.rejected, (state, { payload }) => {
      state.loading.categoryWise = false;
      state.categoryWise = [];
      state.error = payload;
    });
    builder.addCase(fetchFilters.pending, (state) => {
      state.loading.filters = true;
      state.error = null;
    });
    builder.addCase(fetchFilters.fulfilled, (state, { payload }) => {
      state.loading.filters = false;
      state.filters = payload || initialState.filters;
    });
    builder.addCase(fetchFilters.rejected, (state, { payload }) => {
      state.loading.filters = false;
      state.error = payload;
    });
  },
});

export const { clearUploadResult, clearError, setError } = salesSlice.actions;
export default salesSlice.reducer;

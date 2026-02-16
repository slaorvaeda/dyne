"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as salesApi from "@/services/salesApi";

export const uploadSales = createAsyncThunk(
  "sales/upload",
  async (file, { rejectWithValue }) => {
    try {
      const data = await salesApi.uploadSalesFile(file);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || "Upload failed");
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
      return rejectWithValue(err.response?.data?.message || err.message);
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
      return rejectWithValue(err.response?.data?.message || err.message);
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
      return rejectWithValue(err.response?.data?.message || err.message);
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
      return rejectWithValue(err.response?.data?.message || err.message);
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
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  summary: { totalRevenue: 0, totalQuantity: 0 },
  trends: [],
  productWise: [],
  regionWise: [],
  filters: { categories: [], regions: [] },
  upload: { recordsInserted: null, error: null },
  loading: {
    summary: false,
    trends: false,
    productWise: false,
    regionWise: false,
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
      state.upload = { recordsInserted: null, error: null };
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadSales.pending, (state) => {
      state.loading.upload = true;
      state.upload = { recordsInserted: null, error: null };
    });
    builder.addCase(uploadSales.fulfilled, (state, { payload }) => {
      state.loading.upload = false;
      state.upload = { recordsInserted: payload?.recordsInserted ?? payload ?? null, error: null };
    });
    builder.addCase(uploadSales.rejected, (state, { payload }) => {
      state.loading.upload = false;
      state.upload = { recordsInserted: null, error: payload || "Upload failed" };
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
    builder.addCase(fetchFilters.pending, (state) => {
      state.loading.filters = true;
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

export const { clearUploadResult, clearError } = salesSlice.actions;
export default salesSlice.reducer;

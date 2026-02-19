"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ratingsApi from "@/services/ratingsApi";

export const uploadRatings = createAsyncThunk(
  "ratings/upload",
  async (payload, { rejectWithValue }) => {
    try {
      const file = typeof payload === "object" && payload?.file != null ? payload.file : payload;
      const replace = typeof payload === "object" && payload?.replace === true;
      const data = await ratingsApi.uploadRatingsFile(file, { replace });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Upload failed");
    }
  }
);

export const fetchProductsPerCategory = createAsyncThunk(
  "ratings/fetchProductsPerCategory",
  async (params, { rejectWithValue }) => {
    try {
      const data = await ratingsApi.getProductsPerCategory(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

export const fetchTopReviewed = createAsyncThunk(
  "ratings/fetchTopReviewed",
  async (params, { rejectWithValue }) => {
    try {
      const data = await ratingsApi.getTopReviewed(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

export const fetchDiscountDistribution = createAsyncThunk(
  "ratings/fetchDiscountDistribution",
  async (params, { rejectWithValue }) => {
    try {
      const data = await ratingsApi.getDiscountDistribution(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

export const fetchCategoryAvgRating = createAsyncThunk(
  "ratings/fetchCategoryAvgRating",
  async (params, { rejectWithValue }) => {
    try {
      const data = await ratingsApi.getCategoryAvgRating(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

export const fetchRatingsList = createAsyncThunk(
  "ratings/fetchRatingsList",
  async (params, { rejectWithValue }) => {
    try {
      const data = await ratingsApi.getRatingsList(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

export const fetchRatingsFilters = createAsyncThunk(
  "ratings/fetchRatingsFilters",
  async (_, { rejectWithValue }) => {
    try {
      const data = await ratingsApi.getRatingsFilters();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Request failed");
    }
  }
);

const initialState = {
  productsPerCategory: [],
  topReviewed: [],
  discountDistribution: [],
  categoryAvgRating: [],
  list: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
  filters: { categories: [], ratings: [] },
  upload: { recordsInserted: null, error: null, replaced: false },
  loading: {
    productsPerCategory: false,
    topReviewed: false,
    discountDistribution: false,
    categoryAvgRating: false,
    list: false,
    upload: false,
    filters: false,
  },
  error: null,
};

const ratingsSlice = createSlice({
  name: "ratings",
  initialState,
  reducers: {
    clearRatingsUploadResult: (state) => {
      state.upload = { recordsInserted: null, error: null, replaced: false };
      state.error = null;
    },
    clearRatingsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadRatings.pending, (state) => {
      state.loading.upload = true;
      state.upload = { recordsInserted: null, error: null, replaced: false };
    });
    builder.addCase(uploadRatings.fulfilled, (state, { payload }) => {
      state.loading.upload = false;
      state.upload = {
        recordsInserted: payload?.recordsInserted ?? payload ?? null,
        error: null,
        replaced: payload?.replaced ?? false,
      };
    });
    builder.addCase(uploadRatings.rejected, (state, { payload }) => {
      state.loading.upload = false;
      state.upload = { recordsInserted: null, error: payload || "Upload failed", replaced: false };
    });
    builder.addCase(fetchProductsPerCategory.pending, (state) => {
      state.loading.productsPerCategory = true;
      state.error = null;
    });
    builder.addCase(fetchProductsPerCategory.fulfilled, (state, { payload }) => {
      state.loading.productsPerCategory = false;
      state.productsPerCategory = Array.isArray(payload) ? payload : [];
    });
    builder.addCase(fetchProductsPerCategory.rejected, (state, { payload }) => {
      state.loading.productsPerCategory = false;
      state.productsPerCategory = [];
      state.error = payload;
    });
    builder.addCase(fetchTopReviewed.pending, (state) => {
      state.loading.topReviewed = true;
      state.error = null;
    });
    builder.addCase(fetchTopReviewed.fulfilled, (state, { payload }) => {
      state.loading.topReviewed = false;
      state.topReviewed = Array.isArray(payload) ? payload : [];
    });
    builder.addCase(fetchTopReviewed.rejected, (state, { payload }) => {
      state.loading.topReviewed = false;
      state.topReviewed = [];
      state.error = payload;
    });
    builder.addCase(fetchDiscountDistribution.pending, (state) => {
      state.loading.discountDistribution = true;
      state.error = null;
    });
    builder.addCase(fetchDiscountDistribution.fulfilled, (state, { payload }) => {
      state.loading.discountDistribution = false;
      state.discountDistribution = Array.isArray(payload) ? payload : [];
    });
    builder.addCase(fetchDiscountDistribution.rejected, (state, { payload }) => {
      state.loading.discountDistribution = false;
      state.discountDistribution = [];
      state.error = payload;
    });
    builder.addCase(fetchCategoryAvgRating.pending, (state) => {
      state.loading.categoryAvgRating = true;
      state.error = null;
    });
    builder.addCase(fetchCategoryAvgRating.fulfilled, (state, { payload }) => {
      state.loading.categoryAvgRating = false;
      state.categoryAvgRating = Array.isArray(payload) ? payload : [];
    });
    builder.addCase(fetchCategoryAvgRating.rejected, (state, { payload }) => {
      state.loading.categoryAvgRating = false;
      state.categoryAvgRating = [];
      state.error = payload;
    });
    builder.addCase(fetchRatingsList.pending, (state) => {
      state.loading.list = true;
      state.error = null;
    });
    builder.addCase(fetchRatingsList.fulfilled, (state, { payload }) => {
      state.loading.list = false;
      state.list = {
        data: Array.isArray(payload?.data) ? payload.data : [],
        total: payload?.total ?? 0,
        page: payload?.page ?? 1,
        limit: payload?.limit ?? 10,
        totalPages: payload?.totalPages ?? 0,
      };
    });
    builder.addCase(fetchRatingsList.rejected, (state, { payload }) => {
      state.loading.list = false;
      state.list = initialState.list;
      state.error = payload;
    });
    builder.addCase(fetchRatingsFilters.pending, (state) => {
      state.loading.filters = true;
      state.error = null;
    });
    builder.addCase(fetchRatingsFilters.fulfilled, (state, { payload }) => {
      state.loading.filters = false;
      state.filters = {
        categories: Array.isArray(payload?.categories) ? payload.categories : [],
        ratings: Array.isArray(payload?.ratings) ? payload.ratings : [],
      };
    });
    builder.addCase(fetchRatingsFilters.rejected, (state, { payload }) => {
      state.loading.filters = false;
      state.error = payload;
    });
  },
});

export const { clearRatingsUploadResult, clearRatingsError } = ratingsSlice.actions;
export default ratingsSlice.reducer;

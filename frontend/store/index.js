"use client";

import { configureStore } from "@reduxjs/toolkit";
import salesReducer from "./slices/salesSlice";
import ratingsReducer from "./slices/ratingsSlice";

export const store = configureStore({
  reducer: {
    sales: salesReducer,
    ratings: ratingsReducer,
  },
});

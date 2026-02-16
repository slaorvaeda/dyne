"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, CircularProgress } from "@mui/material";
import {
  fetchSummary,
  fetchTrends,
  fetchProductWise,
  fetchRegionWise,
  fetchFilters,
} from "@/store/slices/salesSlice";
import AnalyticsPageHeader from "@/components/Dashboard/AnalyticsPageHeader";
import {
  SalesGrowthCard,
  WinRateCard,
  RevenueGrowthCard,
  QuarterlySalesCard,
} from "@/components/Dashboard/AnalyticsKPICards";
import AnalyticsSalesOverviewCard from "@/components/Dashboard/AnalyticsSalesOverviewCard";
import AnalyticsSalesByCountriesCard from "@/components/Dashboard/AnalyticsSalesByCountriesCard";
import dayjs from "dayjs";
import {
  dummySummary,
  dummyTrends,
  dummyFilters,
} from "@/data/dummySalesData";

const defaultStart = dayjs().subtract(1, "month").format("YYYY-MM-DD");
const defaultEnd = dayjs().format("YYYY-MM-DD");

// Mini chart data for KPI cards (from trends or static)
const miniLineData = (trends) =>
  (trends || []).slice(0, 14).map((d) => ({ v: Math.round((d.revenue || 0) / 2000) }));

export default function DashboardPage() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [category, setCategory] = useState(null);
  const [region, setRegion] = useState(null);

  const summary = useSelector((state) => state.sales.summary);
  const trends = useSelector((state) => state.sales.trends);
  const filters = useSelector((state) => state.sales.filters);
  const loading = useSelector((state) => state.sales.loading);

  const params = useMemo(
    () => ({
      startDate,
      endDate,
      ...(category && { category }),
      ...(region && { region }),
    }),
    [startDate, endDate, category, region]
  );

  const loadData = useCallback(() => {
    dispatch(fetchSummary(params));
    dispatch(fetchTrends({ ...params, type: "daily" }));
    dispatch(fetchProductWise(params));
    dispatch(fetchRegionWise(params));
  }, [dispatch, params]);

  useEffect(() => {
    dispatch(fetchFilters());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isLoading = loading.summary || loading.trends;

  const displayTrends = useMemo(
    () => (Array.isArray(trends) && trends.length > 0 ? trends : dummyTrends),
    [trends]
  );
  const displayFilters = useMemo(
    () =>
      filters.categories?.length > 0 || filters.regions?.length > 0
        ? filters
        : { categories: dummyFilters.categories, regions: dummyFilters.regions },
    [filters]
  );

  const totalRevenue = summary?.totalRevenue ?? dummySummary.totalRevenue;
  const revenueGrowthPct = totalRevenue > 0 ? "+65%" : "+65%";
  const quarterlyCurrent = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Math.round(totalRevenue * 0.85)
  );
  const quarterlyTotal = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    totalRevenue
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400, color: "text.primary" }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflow: "hidden", color: "text.primary" }}>
      <AnalyticsPageHeader
        title="Analytics"
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {/* KPI row: full-width flex, cards stretch equally */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 6,
          width: "100%",
          alignItems: "stretch",
          minHeight: 320,
          "& > *": {
            flex: "1 1 200px",
            minWidth: 0,
            maxWidth: { xs: "100%", sm: "none" },
            display: "flex",
            minHeight: 320,
          },
        }}
      >
        <SalesGrowthCard value="+50%" subtitle="sales boost, driving growth." data={miniLineData(displayTrends)} />
        <WinRateCard value="80%" subtitle="of 5,000 leads" />
        <RevenueGrowthCard value={revenueGrowthPct} subtitle="A remarkable 65% revenue growth driving success." />
        <QuarterlySalesCard total={quarterlyTotal} current={quarterlyCurrent} pct={85} targetLabel="8% of the target" />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} xl={4}>
          <AnalyticsSalesOverviewCard
            value="100%"
            data={[{ name: "Salary", value: 35 }, { name: "Finance", value: 45 }, { name: "Bonus", value: 20 }]}
          />
        </Grid>
        <Grid item xs={12} xl={8}>
          <AnalyticsSalesByCountriesCard />
        </Grid>
      </Grid>
    </Box>
  );
}

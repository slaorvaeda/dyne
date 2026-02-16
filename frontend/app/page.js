"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import {
  fetchSummary,
  fetchTrends,
  fetchProductWise,
  fetchRegionWise,
  fetchFilters,
} from "@/store/slices/salesSlice";
import AnalyticsPageHeader from "@/components/Dashboard/AnalyticsPageHeader";
import Filters from "@/components/Dashboard/Filters";
import {
  SalesGrowthCard,
  WinRateCard,
  RevenueGrowthCard,
  QuarterlySalesCard,
} from "@/components/Dashboard/AnalyticsKPICards";
import AnalyticsSalesOverviewCard from "@/components/Dashboard/AnalyticsSalesOverviewCard";
import AnalyticsSalesByCountriesCard from "@/components/Dashboard/AnalyticsSalesByCountriesCard";
import RevenueLineChart from "@/components/Dashboard/RevenueLineChart";
import ProductBarChart from "@/components/Dashboard/ProductBarChart";
import RegionPieChart from "@/components/Dashboard/RegionPieChart";
import { Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";
import {
  dummySummary,
  dummyTrends,
  dummyFilters,
  dummyProductWise,
  dummyRegionWise,
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
  const productWise = useSelector((state) => state.sales.productWise);
  const regionWise = useSelector((state) => state.sales.regionWise);
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
  const displayProductWise = useMemo(
    () => (Array.isArray(productWise) && productWise.length > 0 ? productWise : dummyProductWise),
    [productWise]
  );
  const displayRegionWise = useMemo(
    () => (Array.isArray(regionWise) && regionWise.length > 0 ? regionWise : dummyRegionWise),
    [regionWise]
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
      <AnalyticsPageHeader title="Analytics" />

      <Filters
        startDate={startDate}
        endDate={endDate}
        category={category}
        region={region}
        categories={displayFilters.categories || []}
        regions={displayFilters.regions || []}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onCategoryChange={setCategory}
        onRegionChange={setRegion}
      />

      {/* Line: Revenue trends | Bar: Product-wise | Pie: Revenue by region */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 6 }}>
        <Card sx={{ flex: "1 1 340px", minWidth: 0, borderRadius: "2rem", bgcolor: "background.paper" }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
              Revenue trends over time
            </Typography>
            <Box sx={{ width: "100%", height: 320 }}>
              <RevenueLineChart data={displayTrends} />
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 340px", minWidth: 0, borderRadius: "2rem", bgcolor: "background.paper" }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
              Product-wise sales
            </Typography>
            <Box sx={{ width: "100%", height: 320 }}>
              <ProductBarChart data={displayProductWise} />
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 320px", minWidth: 0, maxWidth: 420, borderRadius: "2rem", bgcolor: "background.paper" }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
              Revenue by region
            </Typography>
            <Box sx={{ width: "100%", height: 320 }}>
              <RegionPieChart data={displayRegionWise} />
            </Box>
          </CardContent>
        </Card>
      </Box>

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

      {/* Sales Overview (narrower) + Sales by Countries (wider): full row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          width: "100%",
          "& > *": { minHeight: 580, minWidth: 0 },
          "& > *:first-of-type": { flex: { md: "0 0 35%" } },
          "& > *:last-of-type": { flex: { md: "1 1 65%" } },
        }}
      >
        <AnalyticsSalesOverviewCard
          value="100%"
          data={[{ name: "Salary", value: 35 }, { name: "Finance", value: 45 }, { name: "Bonus", value: 20 }]}
        />
        <AnalyticsSalesByCountriesCard />
      </Box>
    </Box>
  );
}

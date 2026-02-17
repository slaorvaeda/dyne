"use client";

import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Alert, Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import {
  fetchSummary,
  fetchTrends,
  fetchProductWise,
  fetchRegionWise,
  fetchCategoryWise,
  fetchFilters,
  clearError,
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
import CategoryBarChart from "@/components/Dashboard/CategoryBarChart";
import { Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";

const defaultStart = dayjs().subtract(1, "month").format("YYYY-MM-DD");
const defaultEnd = dayjs().format("YYYY-MM-DD");

// scale revenue for mini KPI charts
const miniLineData = (trends) => {
  const arr = (trends || []).slice(0, 31);
  if (arr.length === 0) return [{ v: 0 }];
  const maxR = Math.max(1, ...arr.map((d) => d.revenue || 0));
  return arr.map((d) => ({ v: Math.round((Number(d.revenue) || 0) / maxR * 100) }));
};

// growth: second half vs first half of period
const salesGrowthFromTrends = (trends) => {
  const arr = Array.isArray(trends) ? trends : [];
  if (arr.length < 2) return { pct: "0%", subtitle: arr.length === 0 ? "No trend data" : "Single data point" };
  const mid = Math.floor(arr.length / 2);
  const firstHalf = arr.slice(0, mid).reduce((s, d) => s + (Number(d.revenue) || 0), 0);
  const secondHalf = arr.slice(mid).reduce((s, d) => s + (Number(d.revenue) || 0), 0);
  if (firstHalf === 0) return { pct: secondHalf > 0 ? "+100%" : "0%", subtitle: "vs first half of period" };
  const change = ((secondHalf - firstHalf) / firstHalf) * 100;
  const sign = change >= 0 ? "+" : "";
  return { pct: `${sign}${Math.round(change)}%`, subtitle: "vs first half of period" };
};

// % of days in range that had sales
const winRateFromTrendsAndRange = (trends, startDate, endDate) => {
  const daysWithSales = Array.isArray(trends) ? trends.length : 0;
  if (!startDate || !endDate) return { pct: "0%", subtitle: "of days in period" };
  const total = dayjs(endDate).diff(dayjs(startDate), "day") + 1;
  if (total <= 0) return { pct: "0%", subtitle: "of days in period" };
  const pct = Math.min(100, Math.round((daysWithSales / total) * 100));
  return { pct: `${pct}%`, subtitle: `of ${total} days in period` };
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [category, setCategory] = useState(null);
  const [region, setRegion] = useState(null);
  const [trendType, setTrendType] = useState("daily");

  const summary = useSelector((state) => state.sales.summary);
  const trends = useSelector((state) => state.sales.trends);
  const productWise = useSelector((state) => state.sales.productWise);
  const regionWise = useSelector((state) => state.sales.regionWise);
  const categoryWise = useSelector((state) => state.sales.categoryWise);
  const filters = useSelector((state) => state.sales.filters);
  const upload = useSelector((state) => state.sales.upload);
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
    dispatch(fetchTrends({ ...params, type: trendType }));
    dispatch(fetchProductWise(params));
    dispatch(fetchRegionWise(params));
    dispatch(fetchCategoryWise(params));
  }, [dispatch, params, trendType]);

  useEffect(() => {
    dispatch(fetchFilters());
  }, [dispatch]);

  const lastUploadInserted = useRef(null);
  // refetch data after upload so charts update
  useEffect(() => {
    const inserted = upload?.recordsInserted;
    if (inserted != null && typeof inserted === "number" && lastUploadInserted.current !== inserted) {
      lastUploadInserted.current = inserted;
      dispatch(fetchFilters());
      loadData();
    }
  }, [upload?.recordsInserted, dispatch, loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isLoading = loading.summary || loading.trends || loading.productWise || loading.regionWise || loading.categoryWise;
  const error = useSelector((state) => state.sales.error);

  const displayTrends = useMemo(() => (Array.isArray(trends) ? trends : []), [trends]);
  const displayProductWise = useMemo(() => (Array.isArray(productWise) ? productWise : []), [productWise]);
  const displayRegionWise = useMemo(() => (Array.isArray(regionWise) ? regionWise : []), [regionWise]);
  const displayCategoryWise = useMemo(() => (Array.isArray(categoryWise) ? categoryWise : []), [categoryWise]);
  // allowed filter categories
  const ALLOWED_CATEGORIES = [
    "Computers&Accessories",
    "Electronics",
    "Home&Kitchen",
    "HomeImprovement",
    "MusicalInstruments",
    "OfficeProducts",
  ];
  const displayFilters = useMemo(() => {
    const fromApi = (list) => {
      if (!Array.isArray(list)) return [];
      return list
        .map((x) => (x != null ? String(x).trim() : ""))
        .filter((x) => x.length > 0);
    };
    const apiCategories = fromApi(filters.categories);
    const categories = apiCategories.filter((c) => ALLOWED_CATEGORIES.includes(c));
    return {
      categories,
      regions: fromApi(filters.regions),
    };
  }, [filters]);

  const totalRevenue = Number(summary?.totalRevenue) || 0;
  const totalQuantity = Number(summary?.totalQuantity) || 0;
  const { pct: salesGrowthPct, subtitle: salesGrowthSubtitle } = useMemo(
    () => salesGrowthFromTrends(displayTrends),
    [displayTrends]
  );
  const { pct: winRatePct, subtitle: winRateSubtitle } = useMemo(
    () => winRateFromTrendsAndRange(displayTrends, startDate, endDate),
    [displayTrends, startDate, endDate]
  );
  const revenueGrowthPct = salesGrowthPct;
  const revenueGrowthSubtitle = displayTrends.length < 2 ? (displayTrends.length === 0 ? "No trend data" : "Single data point") : "revenue vs first half of period";
  const quarterlyTotal = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    totalRevenue
  );
  const topRegion = displayRegionWise.length > 0 ? displayRegionWise[0] : null;
  const topRegionRevenue = topRegion ? Number(topRegion.revenue) || 0 : 0;
  const quarterlyPct = totalRevenue > 0 && topRegionRevenue > 0 ? Math.round((topRegionRevenue / totalRevenue) * 100) : 0;
  const quarterlyCurrent = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Math.round(topRegionRevenue)
  );
  const quarterlyTargetLabel = String(quarterlyPct);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400, color: "text.primary" }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  const hasNoData = totalRevenue === 0 && displayTrends.length === 0 && displayProductWise.length === 0 && displayRegionWise.length === 0;

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflow: "hidden", color: "text.primary" }}>
      <AnalyticsPageHeader title="Analytics" />
      {error && (
        <Alert
          severity="error"
          onClose={() => dispatch(clearError())}
          action={
            <Button color="inherit" size="small" onClick={() => dispatch(clearError())}>
              Dismiss
            </Button>
          }
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
      {hasNoData && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: "action.hover",
            border: "1px dashed",
            borderColor: "divider",
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">
            No sales data yet. Upload a CSV or Excel file above to see analytics.
          </Typography>
        </Box>
      )}

      <Filters
        startDate={startDate}
        endDate={endDate}
        category={category}
        region={region}
        categories={displayFilters.categories || []}
        regions={displayFilters.regions || []}
        filtersLoading={loading.filters}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onCategoryChange={setCategory}
        onRegionChange={setRegion}
      />

      {/* charts row */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 6 }}>
        <Card sx={{ flex: "1 1 340px", minWidth: 0, borderRadius: "2rem", bgcolor: "background.paper" }}>
          <CardContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                Revenue trends over time
              </Typography>
              <ToggleButtonGroup
                value={trendType}
                exclusive
                onChange={(_, v) => v != null && setTrendType(v)}
                size="small"
                sx={{ "& .MuiToggleButton-root": { py: 0.25, px: 1, fontSize: "0.75rem" } }}
              >
                <ToggleButton value="daily">Daily</ToggleButton>
                <ToggleButton value="weekly">Weekly</ToggleButton>
                <ToggleButton value="monthly">Monthly</ToggleButton>
              </ToggleButtonGroup>
            </Box>
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

      {/* KPI cards */}
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
        <SalesGrowthCard value={salesGrowthPct} subtitle={salesGrowthSubtitle} data={miniLineData(displayTrends)} />
        <WinRateCard value={winRatePct} subtitle={winRateSubtitle} />
        <RevenueGrowthCard value={revenueGrowthPct} subtitle={revenueGrowthSubtitle} data={miniLineData(displayTrends)} />
        <QuarterlySalesCard
          total={quarterlyTotal}
          current={quarterlyCurrent}
          pct={quarterlyPct}
          targetLabel={quarterlyTargetLabel}
          legendPrimary="Top region"
          legendSecondary="Other regions"
        />
      </Box>

      {/* category, overview, region — one row, equal width */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          width: "100%",
          alignItems: "stretch",
          "& > *": { minWidth: 0, flex: { md: "1 1 0px" }, minHeight: 420 },
        }}
      >
        <Card
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            p: 3,
            borderRadius: "2rem",
            boxShadow: 1,
            height: "100%",
          }}
        >
          <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 6, height: 24, bgcolor: "primary.main", borderRadius: "9999px" }} />
              <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
                Revenue by category
              </Typography>
            </Box>
            <Box sx={{ width: "100%", height: 256, minHeight: 256 }}>
              <CategoryBarChart data={displayCategoryWise} height={256} />
            </Box>
          </CardContent>
        </Card>
        <AnalyticsSalesOverviewCard
          value={new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(totalRevenue)}
          data={displayRegionWise}
        />
        <AnalyticsSalesByCountriesCard data={displayRegionWise} />
      </Box>
    </Box>
  );
}

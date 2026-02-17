"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { fetchTrends, fetchFilters, clearError } from "@/store/slices/salesSlice";
import Filters from "@/components/Dashboard/Filters";
import RevenueLineChart from "@/components/Dashboard/RevenueLineChart";
import dayjs from "dayjs";

const defaultStart = dayjs().subtract(1, "month").format("YYYY-MM-DD");
const defaultEnd = dayjs().format("YYYY-MM-DD");

const ALLOWED_CATEGORIES = [
  "Computers&Accessories",
  "Electronics",
  "Home&Kitchen",
  "HomeImprovement",
  "MusicalInstruments",
  "OfficeProducts",
];

export default function RevenueTrendsPage() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [category, setCategory] = useState(null);
  const [region, setRegion] = useState(null);
  const [trendType, setTrendType] = useState("daily");

  const trends = useSelector((state) => state.sales.trends);
  const filters = useSelector((state) => state.sales.filters);
  const loading = useSelector((state) => state.sales.loading);
  const error = useSelector((state) => state.sales.error);

  const params = useMemo(
    () => ({
      startDate,
      endDate,
      ...(category && { category }),
      ...(region && { region }),
    }),
    [startDate, endDate, category, region]
  );

  const displayFilters = useMemo(() => {
    const fromApi = (list) => {
      if (!Array.isArray(list)) return [];
      return list.map((x) => (x != null ? String(x).trim() : "")).filter((x) => x.length > 0);
    };
    const apiCategories = fromApi(filters.categories);
    const categories = apiCategories.filter((c) => ALLOWED_CATEGORIES.includes(c));
    return { categories, regions: fromApi(filters.regions) };
  }, [filters]);

  const loadData = useCallback(() => {
    dispatch(fetchTrends({ ...params, type: trendType }));
  }, [dispatch, params, trendType]);

  useEffect(() => {
    dispatch(fetchFilters());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const displayTrends = useMemo(() => (Array.isArray(trends) ? trends : []), [trends]);
  const isLoading = loading.trends;
  const hasNoData = displayTrends.length === 0;
  const totalRevenue = useMemo(
    () => displayTrends.reduce((sum, d) => sum + (Number(d.revenue) || 0), 0),
    [displayTrends]
  );

  return (
    <Box sx={{ width: "100%", color: "text.primary" }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}>
          Revenue trends over time
        </Typography>
        <ToggleButtonGroup
          value={trendType}
          exclusive
          onChange={(_, v) => v != null && setTrendType(v)}
          size="small"
        >
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {trendType === "daily" && "Daily revenue over the selected period."}
        {trendType === "weekly" && "Weekly revenue over the selected period."}
        {trendType === "monthly" && "Monthly revenue over the selected period."}
        {" Use filters to narrow by category or region."}
      </Typography>

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

      <Filters
        startDate={startDate}
        endDate={endDate}
        category={category}
        region={region}
        categories={displayFilters.categories}
        regions={displayFilters.regions}
        filtersLoading={loading.filters}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onCategoryChange={setCategory}
        onRegionChange={setRegion}
      />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <>
          <Card
            sx={{
              mb: 3,
              borderRadius: "2rem",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 1,
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                Daily revenue
              </Typography>
              {!hasNoData && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total in period: ₹{totalRevenue.toLocaleString("en-IN")}
                </Typography>
              )}
              <Box sx={{ width: "100%", height: 480, minHeight: 480 }}>
                <RevenueLineChart data={displayTrends} height={480} />
              </Box>
            </CardContent>
          </Card>

          {hasNoData ? (
            <Card sx={{ borderRadius: "2rem", bgcolor: "action.hover", border: "1px dashed", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No trend data for the selected period. Upload a CSV/Excel from the Dashboard or adjust filters.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                borderRadius: "2rem",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 1,
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                  Daily revenue table
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", maxHeight: 400 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Revenue
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...displayTrends].reverse().map((row, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{row.date || "—"}</TableCell>
                          <TableCell align="right">
                            ₹{Number(row.revenue || 0).toLocaleString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}

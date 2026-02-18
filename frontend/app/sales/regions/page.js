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
} from "@mui/material";
import { fetchRegionWise, fetchFilters, clearError } from "@/store/slices/salesSlice";
import Filters from "@/components/Dashboard/Filters";
import AnalyticsSalesByCountriesCard from "@/components/Dashboard/AnalyticsSalesByCountriesCard";
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

export default function RegionsReportPage() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [category, setCategory] = useState(null);
  const [region, setRegion] = useState(null);

  const regionWise = useSelector((state) => state.sales.regionWise);
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
    dispatch(fetchRegionWise(params));
  }, [dispatch, params]);

  useEffect(() => {
    dispatch(fetchFilters());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const displayRegionWise = useMemo(() => (Array.isArray(regionWise) ? regionWise : []), [regionWise]);
  const isLoading = loading.regionWise;
  const hasNoData = displayRegionWise.length === 0;

  return (
    <Box sx={{ width: "100%", color: "text.primary" }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2, fontSize: { xs: "1.75rem", md: "2rem" } }}>
        Revenue by region
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Full report of sales and revenue by region. Use filters to narrow by date range or category.
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
          <Box sx={{ mb: 3 }}>
            <AnalyticsSalesByCountriesCard data={displayRegionWise} />
          </Box>

          {hasNoData ? (
            <Card sx={{ borderRadius: "2rem", bgcolor: "action.hover", border: "1px dashed", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No region data for the selected period. Upload a CSV/Excel from the Dashboard or adjust filters.
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
                  Region revenue table
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Region</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Revenue
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayRegionWise.map((row, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{row.region || "—"}</TableCell>
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

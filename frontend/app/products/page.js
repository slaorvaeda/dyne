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
  TablePagination,
  Paper,
  Alert,
  Button,
} from "@mui/material";
import { fetchProductWise, fetchFilters, clearError } from "@/store/slices/salesSlice";
import Filters from "@/components/Dashboard/Filters";
import ProductBarChart from "@/components/Dashboard/ProductBarChart";
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

export default function ProductWiseSalesPage() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [category, setCategory] = useState(null);
  const [region, setRegion] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const productWise = useSelector((state) => state.sales.productWise);
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
    dispatch(fetchProductWise(params));
  }, [dispatch, params]);

  useEffect(() => {
    dispatch(fetchFilters());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const displayProductWise = useMemo(() => (Array.isArray(productWise) ? productWise : []), [productWise]);

  useEffect(() => {
    setPage(0);
  }, [displayProductWise.length]);
  const isLoading = loading.productWise;
  const hasNoData = displayProductWise.length === 0;

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return displayProductWise.slice(start, start + rowsPerPage);
  }, [displayProductWise, page, rowsPerPage]);
  const totalCount = displayProductWise.length;

  return (
    <Box sx={{ width: "100%", color: "text.primary" }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2, fontSize: { xs: "1.75rem", md: "2rem" } }}>
        Product-wise Sales
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View revenue by product. Use filters to narrow by date range, category, or region.
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
                Revenue by product (top 30)
              </Typography>
              <Box sx={{ width: "100%", height: 480, minHeight: 480 }}>
                <ProductBarChart data={displayProductWise} height={480} maxProducts={30} />
              </Box>
            </CardContent>
          </Card>

          {hasNoData ? (
            <Card sx={{ borderRadius: "2rem", bgcolor: "action.hover", border: "1px dashed", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No product data for the selected period. Upload a CSV/Excel from the Dashboard or adjust filters.
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
                  Product revenue table
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Revenue
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedRows.map((row, index) => (
                        <TableRow key={page * rowsPerPage + index} hover>
                          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                          <TableCell sx={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis" }} title={row.product_name || row.product}>
                            {row.product_name || row.product || "—"}
                          </TableCell>
                          <TableCell align="right">
                            ₹{Number(row.revenue || 0).toLocaleString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    labelRowsPerPage="Rows per page:"
                    showFirstButton
                    showLastButton
                  />
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}

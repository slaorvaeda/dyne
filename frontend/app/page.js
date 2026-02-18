"use client";

import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  uploadRatings,
  fetchProductsPerCategory,
  fetchTopReviewed,
  fetchDiscountDistribution,
  fetchCategoryAvgRating,
  fetchRatingsList,
  fetchRatingsFilters,
  clearRatingsError,
  clearRatingsUploadResult,
} from "@/store/slices/ratingsSlice";

const CHART_COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#1e40af", "#0f172a"];

export default function ProductRatingsReviewPage() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [file, setFile] = useState(null);
  const [replace, setReplace] = useState(false);
  const fileInputRef = useRef(null);

  const productsPerCategory = useSelector((state) => state.ratings.productsPerCategory);
  const topReviewed = useSelector((state) => state.ratings.topReviewed);
  const discountDistribution = useSelector((state) => state.ratings.discountDistribution);
  const categoryAvgRating = useSelector((state) => state.ratings.categoryAvgRating);
  const list = useSelector((state) => state.ratings.list);
  const filters = useSelector((state) => state.ratings.filters);
  const upload = useSelector((state) => state.ratings.upload);
  const loading = useSelector((state) => state.ratings.loading);
  const error = useSelector((state) => state.ratings.error);

  const params = useMemo(
    () => ({
      ...(category && { category }),
      ...(ratingFilter && !isNaN(parseFloat(ratingFilter)) && { ratingMin: parseFloat(ratingFilter) }),
      ...(searchDebounced && { search: searchDebounced }),
    }),
    [category, ratingFilter, searchDebounced]
  );

  const loadCharts = useCallback(() => {
    dispatch(fetchProductsPerCategory(params));
    dispatch(fetchTopReviewed({ ...params, limit: 20 }));
    dispatch(fetchDiscountDistribution(params));
    dispatch(fetchCategoryAvgRating(params));
  }, [dispatch, params]);

  const loadList = useCallback(() => {
    dispatch(
      fetchRatingsList({
        ...params,
        page: page + 1,
        limit: rowsPerPage,
      })
    );
  }, [dispatch, params, page, rowsPerPage]);

  useEffect(() => {
    dispatch(fetchRatingsFilters());
  }, [dispatch]);

  const lastUploadInserted = useRef(null);
  useEffect(() => {
    const inserted = upload?.recordsInserted;
    if (inserted != null && typeof inserted === "number" && lastUploadInserted.current !== inserted) {
      lastUploadInserted.current = inserted;
      dispatch(fetchRatingsFilters());
      loadCharts();
      loadList();
    }
  }, [upload?.recordsInserted, dispatch, loadCharts, loadList]);

  useEffect(() => {
    loadCharts();
  }, [loadCharts]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(0);
  }, [params.category, params.ratingMin, params.search]);

  const handleUpload = () => {
    if (!file) return;
    dispatch(clearRatingsError());
    dispatch(uploadRatings({ file, replace }));
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const isLoading =
    loading.productsPerCategory ||
    loading.topReviewed ||
    loading.discountDistribution ||
    loading.categoryAvgRating ||
    loading.filters;

  const hasNoData =
    productsPerCategory.length === 0 &&
    topReviewed.length === 0 &&
    discountDistribution.length === 0 &&
    categoryAvgRating.length === 0 &&
    list.data.length === 0;

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", color: "text.primary" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StarOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}>
            Product Ratings & Reviews
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Insights into product performance, customer feedback, and review engagement
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          onClose={() => dispatch(clearRatingsError())}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
      {upload.recordsInserted != null && !upload.error && (
        <Alert
          severity="success"
          onClose={() => dispatch(clearRatingsUploadResult())}
          sx={{ mb: 2 }}
        >
          {upload.replaced ? `Data replaced. ${upload.recordsInserted} records inserted.` : `${upload.recordsInserted} records imported.`}
        </Alert>
      )}

      <Card sx={{ borderRadius: "2rem", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
            Upload product & review data (CSV/Excel)
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadOutlinedIcon />}
              sx={{ borderRadius: 2 }}
            >
              Choose file
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Button>
            {file && (
              <Typography variant="body2" color="text.secondary">
                {file.name}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!file || loading.upload}
              sx={{ borderRadius: 2 }}
            >
              {loading.upload ? "Uploading…" : "Upload"}
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <input
                type="checkbox"
                id="replace-ratings"
                checked={replace}
                onChange={(e) => setReplace(e.target.checked)}
              />
              <Typography component="label" htmlFor="replace-ratings" variant="body2" color="text.secondary">
                Replace existing data
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          placeholder="Search by product name"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 220, borderRadius: 2 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {(filters.categories || []).map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={ratingFilter}
            label="Rating"
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {(filters.ratings || []).map((r) => (
              <MenuItem key={r} value={String(r)}>{r}+</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading && !list.data.length ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : hasNoData ? (
        <Card sx={{ borderRadius: "2rem", bgcolor: "action.hover", border: "1px dashed", borderColor: "divider", p: 3, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
            No ratings data yet. Upload a CSV or Excel file (e.g. Dataset.xlsx with product_id, product_name, category, rating, rating_count, discount_percentage) to see charts and table.
          </Typography>
          <Button
            component={Link}
            href="/sales"
            variant="contained"
            endIcon={<ChevronRightIcon />}
            sx={{ borderRadius: "9999px", textTransform: "none", fontWeight: 600 }}
          >
            Go to Sales Analytics
          </Button>
        </Card>
      ) : (
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
            <Card sx={{ borderRadius: "2rem", bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                  Products per category
                </Typography>
                <Box sx={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={productsPerCategory} margin={{ top: 8, right: 8, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={60} interval={0} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} name="Products" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: "2rem", bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                  Top reviewed products
                </Typography>
                <Box sx={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={topReviewed.slice(0, 15)} margin={{ top: 8, right: 8, left: 0, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={80} interval={0} tickFormatter={(v) => (v && v.length > 25 ? v.slice(0, 24) + "…" : v)} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v) => [v, "Reviews"]} labelFormatter={(v) => (v && v.length > 40 ? v.slice(0, 39) + "…" : v)} />
                      <Bar dataKey="review_count" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} name="Reviews" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: "2rem", bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                  Discount distribution
                </Typography>
                <Box sx={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={discountDistribution} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v) => [v, "Count"]} />
                      <Bar dataKey="count" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} name="Count">
                        {(discountDistribution || []).map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: "2rem", bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                  Category-wise average rating
                </Typography>
                <Box sx={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={categoryAvgRating} margin={{ top: 8, right: 8, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={60} interval={0} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 5]} />
                      <Tooltip formatter={(v) => [v, "Avg rating"]} />
                      <Bar dataKey="avg_rating" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} name="Avg rating" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Card sx={{ borderRadius: "2rem", bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Product list
              </Typography>
              {loading.list ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : (
                <>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Rating</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Reviews</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Discount %</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Review preview</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {list.data.map((row) => (
                          <TableRow key={row.id} hover>
                            <TableCell sx={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis" }} title={row.product_name}>
                              {row.product_name || "—"}
                            </TableCell>
                            <TableCell>{row.category || "—"}</TableCell>
                            <TableCell align="right">{row.rating != null ? Number(row.rating).toFixed(1) : "—"}</TableCell>
                            <TableCell align="right">{row.rating_count != null ? row.rating_count.toLocaleString() : "—"}</TableCell>
                            <TableCell align="right">{row.discount_percentage != null ? (Number(row.discount_percentage) <= 1 ? (row.discount_percentage * 100).toFixed(1) : Number(row.discount_percentage).toFixed(1)) : "—"}%</TableCell>
                            <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }} title={row.review_preview}>
                              {row.review_preview || "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={list.total}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      labelRowsPerPage="Rows per page:"
                      showFirstButton
                      showLastButton
                    />
                  </TableContainer>
                </>
              )}
            </CardContent>
          </Card>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              component={Link}
              href="/sales"
              variant="outlined"
              endIcon={<ChevronRightIcon />}
              sx={{ borderRadius: "9999px", textTransform: "none" }}
            >
              Go to Sales Analytics
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

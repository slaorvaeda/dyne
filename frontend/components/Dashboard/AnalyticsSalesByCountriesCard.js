"use client";

import { Card, CardContent, Typography, Box, Button, Select, MenuItem, FormControl, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const STACK_COLORS = ["#f1f5f9", "#60a5fa", "#1d4ed8"]; // light gray, light blue, dark blue (Gross, Net, Equity)

const defaultData = [
  { month: "Jan", grossYield: 8, netYield: 17, potentialEquity: 10 },
  { month: "Feb", grossYield: 7, netYield: 28, potentialEquity: 15 },
  { month: "Mar", grossYield: 10, netYield: 60, potentialEquity: 26 },
  { month: "Apr", grossYield: 8, netYield: 20, potentialEquity: 12 },
  { month: "May", grossYield: 5, netYield: 45, potentialEquity: 20 },
  { month: "Jun", grossYield: 8, netYield: 50, potentialEquity: 22 },
  { month: "Jul", grossYield: 10, netYield: 55, potentialEquity: 24 },
];

export default function AnalyticsSalesByCountriesCard({ data = defaultData }) {
  const theme = useTheme();
  const tickFill = theme.palette.text.secondary;
  const gridStroke = theme.palette.divider;
  const tooltipBg = theme.palette.background.paper;
  const tooltipBorder = theme.palette.divider;

  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        border: "1px solid",
        borderColor: "divider",
        p: 3,
        borderRadius: "2rem",
        boxShadow: 1,
        height: "100%",
      }}
    >
      <CardContent sx={{ "&:last-child": { pb: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 4,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 6, height: 24, bgcolor: "primary.main", borderRadius: "9999px" }} />
            <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
              Sales by Countries
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value="all"
                displayEmpty
                sx={{
                  fontSize: "0.75rem",
                  borderRadius: "9999px",
                  bgcolor: "action.hover",
                  color: "text.primary",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                }}
              >
                <MenuItem value="all">All Products</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value="top"
                displayEmpty
                sx={{
                  fontSize: "0.75rem",
                  borderRadius: "9999px",
                  bgcolor: "action.hover",
                  color: "text.primary",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                }}
              >
                <MenuItem value="top">Top Countries</MenuItem>
              </Select>
            </FormControl>
            <Button size="small" sx={{ minWidth: 0, p: 0.5 }}>
              <OpenInNewIcon sx={{ color: "text.disabled", fontSize: 20 }} />
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="20%" barGap={8}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={gridStroke} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickFill, fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickFill, fontSize: 12 }}
                tickFormatter={(v) => `$${v}k`}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg }}
                formatter={(value, name) => {
                  const labels = { grossYield: "Gross Yield", netYield: "Net Yield", potentialEquity: "Potential Equity" };
                  return [`$${Number(value).toLocaleString()}k`, labels[name] || name];
                }}
              />
              <Bar dataKey="grossYield" fill={STACK_COLORS[0]} radius={[4, 4, 0, 0]} name="Gross Yield" />
              <Bar dataKey="netYield" fill={STACK_COLORS[1]} radius={[4, 4, 0, 0]} name="Net Yield" />
              <Bar dataKey="potentialEquity" fill={STACK_COLORS[2]} radius={[4, 4, 0, 0]} name="Potential Equity" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STACK_COLORS[0] }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Gross Yield
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STACK_COLORS[1] }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Net Yield
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STACK_COLORS[2] }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Potential Equity
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

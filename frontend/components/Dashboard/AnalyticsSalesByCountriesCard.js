"use client";

import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BAR_FILL = "#3b82f6";

export default function AnalyticsSalesByCountriesCard({ data = [] }) {
  const theme = useTheme();
  const tickFill = theme.palette.text.secondary;
  const gridStroke = theme.palette.divider;
  const tooltipBg = theme.palette.background.paper;
  const tooltipBorder = theme.palette.divider;

  const chartData = (Array.isArray(data) ? data : [])
    .map((d) => ({
      name: d.region || "Other",
      revenue: Number(d.revenue) || 0,
    }))
    .filter((d) => d.revenue > 0);

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
              Sales by Region
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: "100%", height: 350, minHeight: 350 }}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="20%" barGap={8}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={gridStroke} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickFill, fontSize: 12 }}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickFill, fontSize: 12 }}
                tickFormatter={(v) => (v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}k`)}
                domain={chartData.length ? undefined : [0, 100]}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg }}
                formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                labelFormatter={(name) => name}
              />
              <Bar dataKey="revenue" fill={BAR_FILL} radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: BAR_FILL }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Revenue
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

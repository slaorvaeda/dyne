"use client";

import { Box, useTheme, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DEFAULT_TOP_PRODUCTS = 15;
const MAX_LABEL_LEN = 20; // axis label length; full name in tooltip

function truncate(str, max = MAX_LABEL_LEN) {
  const s = String(str || "").trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

export default function ProductBarChart({ data = [], height = 320, maxProducts = DEFAULT_TOP_PRODUCTS, maxLabelLength = MAX_LABEL_LEN }) {
  const theme = useTheme();
  const gridStroke = theme.palette.divider;
  const tickFill = theme.palette.text.secondary;

  const chartData = (Array.isArray(data) ? data : [])
    .map((d) => ({
      name: d.product_name || d.product || "Unknown",
      fullName: d.product_name || d.product || "Unknown",
      revenue: Number(d.revenue || d.total_amount) || 0,
    }))
    .filter((d) => d.revenue > 0)
    .slice(0, maxProducts);

  const displayData = chartData.map((d) => ({ ...d, name: truncate(d.name, maxLabelLength) }));
  const hasData = displayData.length > 0;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={displayData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: tickFill }}
          angle={-35}
          textAnchor="end"
          height={72}
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 12, fill: tickFill }}
          tickFormatter={(v) => (v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}k`)}
          domain={hasData ? undefined : [0, 100]}
        />
        <Tooltip
          formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const row = payload[0].payload;
            const label = row?.fullName ?? row?.name ?? "";
            return (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  maxWidth: 380,
                }}
              >
                <Typography variant="caption" color="text.secondary" component="div" sx={{ wordBreak: "break-word" }}>
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  ₹{Number(row?.revenue ?? 0).toLocaleString("en-IN")}
                </Typography>
              </Box>
            );
          }}
        />
        <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

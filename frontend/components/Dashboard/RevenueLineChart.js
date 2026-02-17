"use client";

import { Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function RevenueLineChart({ data = [], height = 320 }) {
  const chartData = (Array.isArray(data) ? data : []).map((d) => ({
    ...d,
    revenue: Number(d.revenue) || 0,
    date: d.date,
  }));

  if (chartData.length === 0) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "text.secondary" }}>
          No trend data
        </Box>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#1976d2"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

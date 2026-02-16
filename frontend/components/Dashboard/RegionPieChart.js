"use client";

import { Box } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Different shades of blue (light → dark)
const BLUE_SHADES = ["#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"];

export default function RegionPieChart({ data = [] }) {
  const chartData = (Array.isArray(data) ? data : []).map((d) => ({
    name: d.region || "Other",
    value: Number(d.revenue || d.total_amount) || 0,
  }));

  if (chartData.length === 0) {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <Box className="flex items-center justify-center h-full text-gray-500">
          No region data
        </Box>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={BLUE_SHADES[i % BLUE_SHADES.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

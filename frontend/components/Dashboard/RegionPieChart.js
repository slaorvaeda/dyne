"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// blue palette for slices
const BLUE_SHADES = ["#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"];

export default function RegionPieChart({ data = [] }) {
  const chartData = (Array.isArray(data) ? data : [])
    .map((d) => ({
      name: d.region || "Other",
      value: Number(d.revenue || d.total_amount) || 0,
    }))
    .filter((d) => d.value > 0);

  const displayData = chartData.length > 0 ? chartData : [{ name: "", value: 0 }];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={displayData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={chartData.length ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
        >
          {displayData.map((_, i) => (
            <Cell key={i} fill={chartData.length ? BLUE_SHADES[i % BLUE_SHADES.length] : "transparent"} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

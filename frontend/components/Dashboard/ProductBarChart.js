"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ProductBarChart({ data = [] }) {
  const chartData = (Array.isArray(data) ? data : []).map((d) => ({
    name: d.product_name || d.product || "Unknown",
    revenue: Number(d.revenue || d.total_amount) || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={80} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
          labelFormatter={(label) => `Product: ${label}`}
        />
        <Legend />
        <Bar dataKey="revenue" name="Revenue" fill="#1976d2" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

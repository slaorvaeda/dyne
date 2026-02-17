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

const MAX_LABEL_LEN = 18;

function truncate(str, max = MAX_LABEL_LEN) {
  const s = String(str || "").trim();
  return s.length <= max ? s : s.slice(0, max - 1) + "…";
}

export default function CategoryBarChart({ data = [], height = 320 }) {
  const theme = useTheme();
  const gridStroke = theme.palette.divider;
  const tickFill = theme.palette.text.secondary;

  const chartData = (Array.isArray(data) ? data : [])
    .map((d) => ({
      name: d.category || "Other",
      fullName: d.category || "Other",
      revenue: Number(d.revenue || d.total_amount) || 0,
    }))
    .filter((d) => d.revenue > 0);

  const displayData = chartData.map((d) => ({ ...d, name: truncate(d.name) }));
  const hasData = displayData.length > 0;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={displayData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: tickFill }}
          angle={-25}
          textAnchor="end"
          height={80}
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
                  maxWidth: 320,
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

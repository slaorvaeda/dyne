"use client";

import Link from "next/link";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const COLORS = ["#0f172a", "#60a5fa", "#93c5fd", "#dbeafe", "#1e40af"];
const ONLINE_COLOR = "#3b82f6"; // blue for "Online" region

/**
 * Sales Overview: center = total revenue (from summary), donut = revenue by region.
 * value: formatted total revenue string (e.g. "₹12.5L")
 * data: region-wise array from API, e.g. [{ region, revenue }]
 */
export default function AnalyticsSalesOverviewCard({ value = "₹0", data = [] }) {
  const chartData = (Array.isArray(data) ? data : []).map((d) => ({
    name: d.region || d.name || "Other",
    value: Number(d.revenue ?? d.value ?? 0),
  })).filter((d) => d.value > 0);

  let otherIndex = 0;
  const colorByIndex = chartData.map((d) => {
    if (String(d.name || "").trim().toLowerCase() === "online") return ONLINE_COLOR;
    const c = COLORS[otherIndex % COLORS.length];
    otherIndex++;
    return c;
  });

  const hasChartData = chartData.length > 0;

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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 6, height: 24, bgcolor: "primary.main", borderRadius: "9999px" }} />
            <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
              Sales Overview
            </Typography>
          </Box>
          <Button size="small" sx={{ minWidth: 0, p: 0.5 }}>
            <MoreVertIcon sx={{ color: "text.disabled" }} />
          </Button>
        </Box>

        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 256, minHeight: 256 }}>
          {hasChartData ? (
            <>
              <Box sx={{ width: "100%", maxWidth: 320, height: 256, minHeight: 256 }}>
                <ResponsiveContainer width="100%" height={256}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={colorByIndex[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString()}`, "Revenue"]} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                  {value}
                </Typography>
                <Typography variant="caption" color="text.secondary">Total revenue</Typography>
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">No sales data for selected period</Typography>
          )}
        </Box>

        {hasChartData && (
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, mt: 2 }}>
            {chartData.map((item, i) => (
              <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colorByIndex[i] }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {item.name}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2" fontWeight={500} color="text.primary">
            Revenue by region
          </Typography>
          <Button
            component={Link}
            href="/regions"
            variant="contained"
            endIcon={<ChevronRightIcon />}
            sx={{
              borderRadius: "9999px",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 2,
              py: 1,
            }}
          >
            View full report
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

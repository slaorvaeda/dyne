"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const PRIMARY = "#3b82f6";

const TitleBlock = ({ title }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box sx={{ width: 6, height: 24, bgcolor: "primary.main", borderRadius: "9999px" }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 500, color: "text.secondary" }}>
        {title}
      </Typography>
    </Box>
    <OpenInNewIcon sx={{ fontSize: 20, color: "text.disabled" }} />
  </Box>
);

const cardSx = (theme) => ({
  bgcolor: theme.palette.mode === "dark" ? "background.default" : "grey.50",
  color: "text.primary",
  p: 3,
  borderRadius: "2rem",
  height: "100%",
  minHeight: 340,
  display: "flex",
  flexDirection: "column",
  transition: "box-shadow 0.3s",
  "&:hover": { boxShadow: 2 },
});

const SALES_GROWTH_GRAD_ID = "salesGrowthAreaGrad";

export function SalesGrowthCard({ value = "+50%", subtitle = "sales boost, driving growth.", data = [] }) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const chartData = Array.isArray(data) && data.length > 0
    ? data.map((d, i) => ({ x: i, v: typeof d === "object" && d?.v != null ? d.v : 0 }))
    : [];
  const safeData = chartData.length > 0 ? chartData : [{ x: 0, v: 0 }];
  return (
    <Card sx={cardSx(theme)}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", "&:last-child": { pb: 3 } }}>
        <TitleBlock title="Sales Growth" />
        <Typography variant="h4" fontWeight={700} sx={{ color: "primary.main", mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: "block", mb: 2 }}>
          {subtitle}
        </Typography>
        <Box sx={{ width: "100%", height: 120, flexShrink: 0, ml: -1, minHeight: 120 }}>
          {mounted && (
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={safeData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                <defs>
                  <linearGradient id={SALES_GROWTH_GRAD_ID} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={PRIMARY} strokeWidth={2} fill={`url(#${SALES_GROWTH_GRAD_ID})`} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export function WinRateCard({ value = "80%", subtitle = "of 5,000 leads" }) {
  const theme = useTheme();
  const pct = parseInt(value, 10) || 80;
  const trackColor = theme.palette.mode === "dark" ? theme.palette.grey[700] : "#f1f5f9";
  return (
    <Card sx={cardSx(theme)}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", "&:last-child": { pb: 3 } }}>
        <TitleBlock title="Win Rate" />
        <Box sx={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 192 }}>
          <Box sx={{ width: "100%", maxWidth: 220, height: 200, minHeight: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[{ name: "done", value: pct }, { name: "rest", value: 100 - pct }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  startAngle={180}
                  endAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={PRIMARY} />
                  <Cell fill={trackColor} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ position: "absolute", bottom: 24, textAlign: "center" }}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function RevenueGrowthCard({
  value = "+65%",
  subtitle = "A remarkable 65% revenue growth driving success.",
  data = [],
}) {
  const theme = useTheme();
  const chartData = Array.isArray(data) && data.length > 0
    ? data.map((d, i) => ({ x: i, v: d?.v ?? d?.r ?? 0 }))
    : [{ x: 0, v: 0 }];
  return (
    <Card sx={cardSx(theme)}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", "&:last-child": { pb: 3 } }}>
        <TitleBlock title="Revenue Growth" />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 1 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: "primary.main" }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "right", fontWeight: 500, maxWidth: 120 }}>
            {subtitle}
          </Typography>
        </Box>
        <Box sx={{ height: 80, width: "100%", minHeight: 80, mt: 1 }}>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Bar dataKey="v" fill={PRIMARY} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export function QuarterlySalesCard({
  total = "₹0",
  current = "₹0",
  pct = 0,
  targetLabel = "0%",
  legendPrimary = "Top region",
  legendSecondary = "Other regions",
}) {
  const theme = useTheme();
  const num = Math.min(100, Math.max(0, typeof pct === "string" ? parseInt(pct, 10) : pct));
  return (
    <Card sx={cardSx(theme)}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", "&:last-child": { pb: 3 } }}>
        <TitleBlock title="Quarterly Sales" />
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3, letterSpacing: "-0.02em", color: "text.primary" }}>
          {total}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ width: "100%", height: 32, bgcolor: "primary.light", borderRadius: "9999px", overflow: "hidden", display: "flex" }}>
            <Box sx={{ width: `${num}%`, bgcolor: "primary.main", borderRadius: "9999px" }} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main" }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {legendPrimary}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.light" }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {legendSecondary}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "9999px",
            py: 0.75,
            pr: 2,
            pl: 0.75,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {typeof targetLabel === "string" ? targetLabel.replace(/\s+of the target.*/i, "").trim() || "0%" : targetLabel}
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              of revenue
            </Typography>
          </Box>
          <OpenInNewIcon sx={{ fontSize: 18, color: "text.disabled" }} />
        </Box>
      </CardContent>
    </Card>
  );
}

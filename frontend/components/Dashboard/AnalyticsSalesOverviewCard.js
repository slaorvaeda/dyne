"use client";

import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const COLORS = ["#0f172a", "#3b82f6", "#dbeafe"]; // slate-900, blue-500, blue-100

export default function AnalyticsSalesOverviewCard({
  value = "100%",
  data = [
    { name: "Salary", value: 35 },
    { name: "Finance", value: 45 },
    { name: "Bonus", value: 20 },
  ],
}) {
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

        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 256 }}>
          <Box sx={{ width: "100%", maxWidth: 320, height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={5}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {value}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
          {data.map((item, i) => (
            <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: COLORS[i % COLORS.length] }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2" fontWeight={500} color="text.primary">
            Learn more
          </Typography>
          <Button
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

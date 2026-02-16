"use client";

import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const COLORS = ["#1a1a1a", "#66bb6a", "#ab47bc"];

export default function SalesOverviewCard({
  value = "100%",
  data = [
    { name: "Salary", value: 50 },
    { name: "Finance", value: 30 },
    { name: "Bonus", value: 20 },
  ],
}) {
  return (
    <Card className="rounded-2xl h-full min-h-[380px] flex flex-col shadow-sm bg-white">
      <CardContent className="flex-1 flex flex-col p-5 pb-5">
        <Box className="flex justify-between items-center mb-2">
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} className="text-[0.8125rem]">
            <Box component="span" className="w-2 h-2 rounded-full bg-blue-600 inline-block mr-1 align-middle" />
            Sales Overview
          </Typography>
          <MoreVertIcon className="w-5 h-5 text-gray-500" />
        </Box>
        <Box className="flex items-center justify-center py-4 relative flex-1 min-h-0">
          <Box className="w-full max-w-[200px] aspect-square mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Typography variant="h5" fontWeight={700} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-gray-900">
            {value}
          </Typography>
        </Box>
        <Box className="flex gap-2 justify-center flex-wrap mb-4">
          {data.map((item, i) => (
            <Box key={item.name} className="flex items-center gap-1">
              <Box
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <Typography variant="caption" color="text.secondary">
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box className="flex items-center justify-between">
          <Typography variant="body2" color="text.secondary">
            Learn more
          </Typography>
          <Button
            size="small"
            endIcon={<OpenInNewIcon className="w-4 h-4" />}
            className="normal-case font-semibold"
          >
            View full report
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

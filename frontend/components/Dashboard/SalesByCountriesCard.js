"use client";

import { Card, CardContent, Typography, Box, FormControl, Select, MenuItem } from "@mui/material";
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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const STACK_COLORS = ["#64b5f6", "#1976d2", "#0d47a1"];

const defaultStackedData = MONTHS.map((month, i) => ({
  month,
  salary: 15000 + i * 3000 + Math.random() * 5000,
  finance: 8000 + i * 2000 + Math.random() * 3000,
  bonus: 5000 + i * 1000 + Math.random() * 2000,
}));

export default function SalesByCountriesCard({ data = defaultStackedData }) {
  return (
    <Card className="rounded-2xl h-full min-h-[380px] flex flex-col shadow-sm bg-white">
      <CardContent className="flex-1 flex flex-col p-5 pb-5 min-h-0">
        <Box className="flex justify-between items-center flex-wrap gap-2 mb-3">
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} className="text-[0.8125rem]">
            <Box component="span" className="w-2 h-2 rounded-full bg-blue-600 inline-block mr-1 align-middle" />
            Sales by Countries
          </Typography>
          <Box className="flex items-center gap-2">
            <FormControl size="small" className="min-w-0 w-full max-w-[140px]">
              <Select value="all" displayEmpty className="rounded-xl text-sm">
                <MenuItem value="all">All Products</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" className="min-w-0 w-full max-w-[140px]">
              <Select value="top" displayEmpty className="rounded-xl text-sm">
                <MenuItem value="top">Top Countries</MenuItem>
              </Select>
            </FormControl>
            <OpenInNewIcon className="w-[18px] h-[18px] text-gray-500" />
          </Box>
        </Box>
        <Box className="flex-1 min-h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                contentStyle={{ borderRadius: 8 }}
              />
              <Legend wrapperStyle={{ fontSize: "0.75rem" }} formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
              <Bar dataKey="salary" stackId="a" fill={STACK_COLORS[0]} radius={[0, 0, 0, 0]} name="Salary" />
              <Bar dataKey="finance" stackId="a" fill={STACK_COLORS[1]} radius={[0, 0, 0, 0]} name="Finance" />
              <Bar dataKey="bonus" stackId="a" fill={STACK_COLORS[2]} radius={[4, 4, 0, 0]} name="Bonus" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box className="flex gap-4 justify-center flex-wrap mt-2">
          <Box className="flex items-center gap-1">
            <Box className="w-2 h-2 rounded-full" style={{ backgroundColor: STACK_COLORS[0] }} />
            <Typography variant="caption" color="text.secondary">
              Salary
            </Typography>
          </Box>
          <Box className="flex items-center gap-1">
            <Box className="w-2 h-2 rounded-full" style={{ backgroundColor: STACK_COLORS[1] }} />
            <Typography variant="caption" color="text.secondary">
              Finance
            </Typography>
          </Box>
          <Box className="flex items-center gap-1">
            <Box className="w-2 h-2 rounded-full" style={{ backgroundColor: STACK_COLORS[2] }} />
            <Typography variant="caption" color="text.secondary">
              Bonus
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

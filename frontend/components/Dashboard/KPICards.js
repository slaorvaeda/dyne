"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const blueDot = <Box className="w-2 h-2 rounded-full bg-blue-600 inline-block mr-1 align-middle" />;

export function SalesGrowthCard({ value = "+50%", subtitle = "sales boost, driving growth.", data = [] }) {
  const chartData = data.length ? data : [{ v: 30 }, { v: 45 }, { v: 40 }, { v: 55 }, { v: 50 }, { v: 65 }, { v: 60 }];
  return (
    <Card className="rounded-2xl h-full min-h-[220px] flex flex-col shadow-sm bg-white">
      <CardContent className="flex-1 flex flex-col p-5 pb-5">
        <Box className="flex justify-between items-start mb-0.5">
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} className="text-[0.8125rem]">
            {blueDot} Sales Growth
          </Typography>
          <OpenInNewIcon className="w-[18px] h-[18px] text-gray-500" />
        </Box>
        <Typography variant="h4" fontWeight={700} className="text-[1.75rem] mb-0.5 text-blue-600">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-3 text-[0.8125rem]">
          {subtitle}
        </Typography>
        <Box className="flex-1 min-h-[56px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="v" stroke="#1976d2" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export function WinRateCard({ value = "80%", subtitle = "of 5,000 leads" }) {
  const pct = parseInt(value, 10) || 80;
  return (
    <Card className="rounded-2xl h-full min-h-[220px] flex flex-col shadow-sm bg-white">
      <CardContent className="flex-1 flex flex-col p-5 pb-5">
        <Box className="flex justify-between items-start mb-0.5">
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} className="text-[0.8125rem]">
            {blueDot} Win Rate
          </Typography>
          <OpenInNewIcon className="w-[18px] h-[18px] text-gray-500" />
        </Box>
        <Box className="flex flex-col items-center justify-center flex-1">
          <Box className="w-full max-w-[140px] aspect-[2/1] relative mx-auto">
            <svg viewBox="0 0 100 50" className="w-full h-full block">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth={12}
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#1976d2"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 125.6} 125.6`}
              />
            </svg>
            <Typography variant="h5" fontWeight={700} className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-2xl text-blue-600">
              {value}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" className="text-[0.8125rem]">
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export function RevenueGrowthCard({
  value = "+65%",
  subtitle = "Revenue growth driving success.",
  data = [],
}) {
  const chartData = data.length
    ? data
    : [
        { name: "1", r: 40 },
        { name: "2", r: 65 },
        { name: "3", r: 55 },
        { name: "4", r: 80 },
        { name: "5", r: 70 },
        { name: "6", r: 90 },
      ];
  return (
    <Card className="rounded-2xl h-full min-h-[220px] flex flex-col shadow-sm bg-white">
      <CardContent className="flex-1 flex flex-col p-5 pb-5">
        <Box className="flex justify-between items-start mb-0.5">
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} className="text-[0.8125rem]">
            {blueDot} Revenue Growth
          </Typography>
          <OpenInNewIcon className="w-[18px] h-[18px] text-gray-500" />
        </Box>
        <Typography variant="h4" fontWeight={700} className="text-[1.75rem] mb-0.5 text-blue-600">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-3 text-[0.8125rem]">
          {subtitle}
        </Typography>
        <Box className="flex-1 min-h-[56px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={0} hide />
              <Bar dataKey="r" fill="#1976d2" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export function QuarterlySalesCard({
  total = "$1,000,000",
  current = "$850,000",
  pct = "85",
  targetLabel = "8% of the target",
}) {
  const num = parseInt(pct, 10) || 85;
  return (
    <Card className="rounded-2xl h-full min-h-[220px] flex flex-col shadow-sm bg-white">
      <CardContent className="flex-1 flex flex-col p-5 pb-5">
        <Box className="flex justify-between items-start mb-0.5">
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} className="text-[0.8125rem]">
            {blueDot} Quarterly Sales
          </Typography>
          <OpenInNewIcon className="w-[18px] h-[18px] text-gray-500" />
        </Box>
        <Typography variant="h4" fontWeight={700} className="text-[1.75rem] text-gray-900">
          {total}
        </Typography>
        <Box className="mt-3 flex-1">
          <Box className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
            <Box
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${num}%` }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" className="block mt-1">
            {current}
          </Typography>
          <Box className="flex items-center gap-1 mt-2">
            <Box className="px-2 py-0.5 rounded text-xs font-semibold text-white bg-blue-600">
              {targetLabel}
            </Box>
            <Typography variant="caption" color="text.secondary">
              →
            </Typography>
          </Box>
          <Box className="flex gap-2 mt-2">
            <Box className="flex items-center gap-1">
              <Box className="w-2 h-2 rounded-full bg-gray-800" />
              <Typography variant="caption" color="text.secondary">
                Salary
              </Typography>
            </Box>
            <Box className="flex items-center gap-1">
              <Box className="w-2 h-2 rounded-full bg-green-300" />
              <Typography variant="caption" color="text.secondary">
                Finance
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

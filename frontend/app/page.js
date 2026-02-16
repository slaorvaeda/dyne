"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import MainContentHeader from "@/components/MainContentHeader";

export default function Home() {
  return (
    <Box>
      <MainContentHeader title="Dashboard" />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Card sx={{ minWidth: { xs: "100%", sm: 200 }, flex: { xs: "1 1 100%", sm: 1 } }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">Total Sales</Typography>
            <Typography variant="h5" fontWeight={600}>₹2,45,000</Typography>
            <Typography variant="caption" color="success.main">+12% from last week</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: { xs: "100%", sm: 200 }, flex: { xs: "1 1 100%", sm: 1 } }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">Total Customers</Typography>
            <Typography variant="h5" fontWeight={600}>1,284</Typography>
            <Typography variant="caption" color="success.main">+8% from last week</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: { xs: "100%", sm: 200 }, flex: { xs: "1 1 100%", sm: 1 } }}>
          <CardContent>
            <Typography color="text.secondary" variant="body2">Total Transactions</Typography>
            <Typography variant="h5" fontWeight={600}>3,562</Typography>
            <Typography variant="caption" color="error.main">-2% from last week</Typography>
          </CardContent>
        </Card>
      </Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Welcome to your dashboard</Typography>
          <Typography color="text.secondary">Your main content, charts, and reports will appear here.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

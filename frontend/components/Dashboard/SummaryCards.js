"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SummaryCards({ totalRevenue = 0, totalQuantity = 0 }) {
  return (
    <Box className="flex gap-4 flex-wrap">
      <Card className="min-w-[220px] flex-1">
        <CardContent>
          <Box className="flex items-center gap-2 mb-2">
            <AttachMoneyIcon color="primary" />
            <Typography color="text.secondary" variant="body2">
              Total Revenue
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={600}>
            {formatCurrency(totalRevenue)}
          </Typography>
        </CardContent>
      </Card>
      <Card className="min-w-[220px] flex-1">
        <CardContent>
          <Box className="flex items-center gap-2 mb-2">
            <ShoppingCartIcon color="primary" />
            <Typography color="text.secondary" variant="body2">
              Total Quantity
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={600}>
            {new Intl.NumberFormat("en-IN").format(totalQuantity)}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

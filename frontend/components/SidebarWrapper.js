"use client";

import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

export default function SidebarWrapper() {
  return (
    <Box sx={{ flexShrink: 0, display: { xs: "none", md: "block" } }}>
      <Sidebar />
    </Box>
  );
}

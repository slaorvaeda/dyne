"use client";

import { useMediaQuery, Box } from "@mui/material";
import Sidebar from "./Sidebar";

export default function SidebarWrapper() {
  const isDesktop = useMediaQuery("(min-width:960px)");
  if (!isDesktop) return null;
  return (
    <Box sx={{ flexShrink: 0 }}>
      <Sidebar />
    </Box>
  );
}

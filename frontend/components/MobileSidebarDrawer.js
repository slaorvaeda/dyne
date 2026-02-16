"use client";

import { Drawer, Box, useMediaQuery } from "@mui/material";
import { useMobileSidebar } from "@/context/MobileSidebarContext";
import Sidebar from "./Sidebar";

export default function MobileSidebarDrawer() {
  const isMobile = useMediaQuery("(max-width:959px)");
  const { open, closeSidebar } = useMobileSidebar();

  if (!isMobile) return null;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={closeSidebar}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: 280,
          maxWidth: "85vw",
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <Box sx={{ height: "100%", overflow: "auto" }}>
        <Sidebar inDrawer onClose={closeSidebar} />
      </Box>
    </Drawer>
  );
}

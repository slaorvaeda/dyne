"use client";

import { Drawer, Box } from "@mui/material";
import { useMobileSidebar } from "@/context/MobileSidebarContext";
import Sidebar from "./Sidebar";

export default function MobileSidebarDrawer() {
  const { open, closeSidebar } = useMobileSidebar();

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

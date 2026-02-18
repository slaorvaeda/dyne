"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useThemeMode } from "@/context/ThemeModeContext";
import { useMobileSidebar } from "@/context/MobileSidebarContext";

const routeTitles = {
  "/": "Ratings & Reviews",
  "/sales": "Sales Dashboard",
  "/sales/trends": "Trends",
  "/sales/products": "Products",
  "/sales/regions": "Regions",
  "/notifications": "Notifications",
  "/help": "Help Center",
  "/settings": "Settings",
  "/profile": "Profile",
};

function getPageTitle(pathname) {
  if (routeTitles[pathname]) return routeTitles[pathname];
  if (pathname.startsWith("/")) {
    const segment = pathname.slice(1).split("/")[0];
    return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : "Ratings & Reviews";
  }
  return "Dashboard";
}

export default function Navbar() {
  const pathname = usePathname();
  const { mode, toggleMode } = useThemeMode();
  const { toggleSidebar } = useMobileSidebar();
  const isMobile = useMediaQuery("(max-width:959px)");
  const isDark = mode === "dark";
  const pageTitle = getPageTitle(pathname || "/");

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 }, pb: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderRadius: { xs: 2, sm: 3 },
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: (t) => (t.palette.mode === "dark" ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.08)"),
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 52, sm: 56 }, gap: 2, px: { xs: 2, sm: 3 }, flexWrap: "wrap" }}>
          {isMobile && (
            <IconButton onClick={toggleSidebar} aria-label="Open menu" sx={{ color: "text.primary", mr: 1 }}>
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary", fontSize: { xs: "1.125rem", sm: "1.25rem" } }}>
            {pageTitle}
          </Typography>
          <Box sx={{ flex: 1, minWidth: 0 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                borderRadius: "9999px",
                bgcolor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
                pl: 2,
                pr: 1.5,
                py: 1,
                minWidth: 180,
              }}
            >
              <SearchOutlinedIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Search"
                size="small"
                sx={{ color: "text.primary", fontSize: "0.875rem", flex: 1 }}
                inputProps={{ "aria-label": "search" }}
              />
            </Box>
            <IconButton size="small" sx={{ color: "text.primary" }} aria-label="notifications">
              <Badge badgeContent={3} color="error">
                <NotificationsOutlinedIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
            <IconButton size="small" sx={{ color: "text.primary", display: { xs: "none", sm: "inline-flex" } }} aria-label="settings">
              <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton size="small" onClick={toggleMode} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} sx={{ color: "text.primary" }}>
              {isDark ? <LightModeOutlinedIcon sx={{ fontSize: 20 }} /> : <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />}
            </IconButton>
            <IconButton component={Link} href="/profile" sx={{ p: 0.5 }} aria-label="profile">
              <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", color: "primary.contrastText", fontSize: "0.875rem" }}>
                U
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

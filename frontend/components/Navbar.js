"use client";

import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  alpha,
  useTheme,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useThemeMode } from "@/context/ThemeModeContext";

const iconSx = { fontSize: 20 };

export default function Navbar() {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, pt: { xs: 1, sm: 1.5 }, pb: 0.5 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "background.paper",
          color: "text.primary",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: { xs: 2, sm: 3, md: 4 },
          overflow: "hidden",
          boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 52, sm: 56 }, gap: 0.5, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }} />

          {/* Search, Notifications, Settings, Theme, Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.25, sm: 0.5 } }}>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                bgcolor: (t) => alpha(t.palette.action.hover, 0.04),
                borderRadius: "9999px",
                border: "1px solid",
                borderColor: "divider",
                px: 1.5,
                py: 0.75,
                minWidth: 180,
              }}
            >
              <SearchOutlinedIcon sx={{ color: "text.secondary", mr: 1, ...iconSx }} />
              <InputBase
                placeholder="Search"
                size="small"
                sx={{ fontSize: "0.875rem", "& input": { py: 0.5 } }}
                inputProps={{ "aria-label": "search" }}
              />
            </Box>
            <IconButton color="inherit" size="small" aria-label="notifications">
              <Badge badgeContent={3} color="error">
                <NotificationsOutlinedIcon sx={iconSx} />
              </Badge>
            </IconButton>
            <IconButton color="inherit" size="small" aria-label="settings" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
              <SettingsOutlinedIcon sx={iconSx} />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              onClick={toggleMode}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <LightModeOutlinedIcon sx={iconSx} /> : <DarkModeOutlinedIcon sx={iconSx} />}
            </IconButton>
            <IconButton component={Link} href="/profile" sx={{ p: 0.5 }} aria-label="profile">
              <Avatar sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 }, bgcolor: "primary.main" }}>
                U
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

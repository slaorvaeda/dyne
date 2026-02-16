"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  alpha,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import InsightsIcon from "@mui/icons-material/Insights";
import { useThemeMode } from "@/context/ThemeModeContext";

const navItems = [
  { label: "Dashboard", href: "/", icon: DashboardOutlinedIcon },
  { label: "Analytics", href: "/analytics", icon: BarChartOutlinedIcon },
  { label: "Performance", href: "/performance", icon: TrendingUpOutlinedIcon },
  { label: "Products", href: "/products", icon: Inventory2OutlinedIcon },
  { label: "Customers", href: "/customers", icon: PeopleOutlinedIcon },
];

const iconSx = { fontSize: 20 };

export default function Navbar() {
  const pathname = usePathname();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, pt: { xs: 1, sm: 2 } }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "background.paper",
          color: "text.primary",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: { xs: 2, sm: 3, md: 50 },
          overflow: "hidden",
          boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, gap: 0.5, px: { xs: 1, sm: 2 } }}>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }}
            aria-label="open menu"
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <IconButton
            component={Link}
            href="/"
            sx={{
              mr: { xs: 1, sm: 2 },
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <InsightsIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
          </IconButton>

          {/* Nav links - desktop only */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              flexGrow: 1,
            }}
          >
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || (href === "/" && pathname === "/");
              return (
                <Button
                  key={href}
                  component={Link}
                  href={href}
                  startIcon={<Icon sx={iconSx} />}
                  sx={{
                    color: active ? "primary.main" : "text.secondary",
                    fontWeight: active ? 600 : 500,
                    px: 1.5,
                    py: 1,
                    minWidth: "auto",
                    borderRadius: 1,
                    borderBottom: active ? 2 : 0,
                    borderColor: "primary.main",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: "primary.main",
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>

          {/* Right: Search (desktop), Notifications, Settings, Theme, Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0, sm: 0.5 }, ml: "auto" }}>
            {/* Search - full bar on md+, icon only on sm, hidden on xs */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                bgcolor: (t) => alpha(t.palette.action.hover, 0.04),
                borderRadius: "9999px",
                px: 2,
                py: 0.75,
                minWidth: { sm: 160, md: 200 },
                border: "1px solid",
                borderColor: "divider",
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
                <NotificationsOutlinedIcon sx={{ fontSize: { xs: 20, sm: 20 } }} />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              aria-label="settings"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              <SettingsOutlinedIcon sx={iconSx} />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              onClick={toggleMode}
              aria-label={isDark ? "switch to light mode" : "switch to dark mode"}
            >
              {isDark ? (
                <LightModeOutlinedIcon sx={iconSx} />
              ) : (
                <DarkModeOutlinedIcon sx={iconSx} />
              )}
            </IconButton>
            <IconButton component={Link} href="/" sx={{ p: 0.5 }} aria-label="profile">
              <Avatar
                sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 }, bgcolor: "primary.main" }}
                src="/avatar.png"
              >
                U
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={closeDrawer}
        slotProps={{
          backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.5)" } },
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            borderRadius: "0 16px 16px 0",
            mt: 0,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ py: 2, px: 1 }}>
          <List disablePadding>
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || (href === "/" && pathname === "/");
              return (
                <ListItem key={href} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={href}
                    onClick={closeDrawer}
                    selected={active}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      "&.Mui-selected": {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: "primary.main",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon
                        sx={{
                          ...iconSx,
                          color: active ? "primary.main" : "text.secondary",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={label} primaryTypographyProps={{ fontWeight: active ? 600 : 500 }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Box sx={{ borderTop: 1, borderColor: "divider", mt: 2, pt: 2, px: 2 }}>
            <ListItemButton
              onClick={() => {
                toggleMode();
                closeDrawer();
              }}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {isDark ? <LightModeOutlinedIcon sx={iconSx} /> : <DarkModeOutlinedIcon sx={iconSx} />}
              </ListItemIcon>
              <ListItemText primary={isDark ? "Light mode" : "Dark mode"} />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

"use client";

import Link from "next/link";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Button,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AcUnitIcon from "@mui/icons-material/AcUnit";

const navItems = [
  { label: "Dashboard", href: "/", icon: DashboardOutlinedIcon },
  { label: "Analytics", href: "/", icon: BarChartIcon, active: true },
  { label: "Performance", href: "/performance", icon: SpeedOutlinedIcon },
  { label: "Products", href: "/products", icon: ShoppingBagOutlinedIcon },
  { label: "Customers", href: "/customers", icon: PeopleOutlinedIcon },
];

export default function AnalyticsNavbar() {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 6 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Toolbar
          sx={{
            minHeight: 72,
            px: { xs: 2, md: 3 },
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: { xs: "column", xl: "row" }, alignItems: "center", gap: 3, flex: 1 }}>
            {/* Logo */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
              }}
            >
              <AcUnitIcon sx={{ color: "white", fontSize: 22 }} />
            </Box>

            {/* Nav links */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                overflowX: "auto",
                pb: { xs: 1, md: 0 },
              }}
            >
              {navItems.map(({ label, href, icon: Icon, active }) => (
                <Button
                  key={label}
                  component={Link}
                  href={href}
                  startIcon={<Icon sx={{ fontSize: 18 }} />}
                  variant={active ? "contained" : "text"}
                  sx={{
                    borderRadius: "9999px",
                    textTransform: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    ...(active
                      ? { bgcolor: "grey.100", color: "text.primary", "&:hover": { bgcolor: "grey.200" } }
                      : { color: "text.secondary", "&:hover": { color: "primary.main" } }),
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Right: Search, Bell, Settings, Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                bgcolor: "grey.50",
                borderRadius: "9999px",
                pl: 2,
                pr: 1.5,
                py: 1,
                minWidth: 256,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <SearchIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Search"
                size="small"
                sx={{ fontSize: "0.875rem", flex: 1 }}
                inputProps={{ "aria-label": "search" }}
              />
            </Box>
            <IconButton size="medium" sx={{ position: "relative" }} aria-label="notifications">
              <Badge badgeContent={1} color="error">
                <NotificationsOutlinedIcon />
              </Badge>
            </IconButton>
            <IconButton size="medium" aria-label="settings">
              <SettingsOutlinedIcon />
            </IconButton>
            <Avatar
              src="https://i.pravatar.cc/150?img=68"
              alt="User"
              sx={{ width: 40, height: 40, border: "2px solid", borderColor: "background.paper", boxShadow: 1 }}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

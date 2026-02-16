"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  IconButton,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import InsightsIcon from "@mui/icons-material/Insights";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const STORAGE_KEY = "sidebarExpanded";

const navItems = [
  { label: "Dashboard", href: "/", icon: DashboardOutlinedIcon },
  { label: "Transactions", href: "/transactions", icon: ReceiptLongOutlinedIcon },
  { label: "Customers", href: "/customers", icon: PeopleOutlinedIcon },
  { label: "Products", href: "/products", icon: ShoppingBagOutlinedIcon },
  { label: "Notifications", href: "/notifications", icon: NotificationsOutlinedIcon },
  { label: "Help Center", href: "/help", icon: HelpOutlineIcon },
  { label: "Settings", href: "/settings", icon: SettingsOutlinedIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [expanded, setExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setExpanded(JSON.parse(stored));
    } catch (_) {}
  }, [mounted]);

  const handleToggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;
  const accentLight = theme.palette.primary.light || theme.palette.primary.main;
  // Use stable values until mounted to avoid hydration mismatch (server vs client)
  const showFull = mounted ? (isDesktop && expanded) : true;
  const sidebarWidth = mounted ? (isDesktop ? (expanded ? 280 : 72) : 72) : 280;

  return (
    <Box
      sx={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        backgroundColor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: theme.transitions.create("width", { duration: theme.transitions.duration.standard }),
      }}
    >
      {/* Brand + Toggle */}
      <Box
        sx={{
          p: showFull ? 2 : 1.5,
          display: "flex",
          flexDirection: showFull ? "row" : "column",
          alignItems: "center",
          justifyContent: showFull ? "space-between" : "center",
          gap: showFull ? 0 : 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: showFull ? "flex-start" : "center", width: showFull ? "auto" : "100%" }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${accent}, ${accentLight})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              flexShrink: 0,
            }}
          >
            <InsightsIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            letterSpacing="-0.02em"
            sx={{ display: showFull ? "block" : "none", overflow: "hidden", whiteSpace: "nowrap" }}
          >
            ANTICS
          </Typography>
        </Box>
        {showFull && (
          <Box
            component="button"
            sx={{
              width: 32,
              height: 32,
              border: "none",
              borderRadius: 1,
              bgcolor: "action.hover",
              color: "text.secondary",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StackedBarChartIcon sx={{ fontSize: 18 }} />
          </Box>
        )}
        {isDesktop && (
          <IconButton
            size="small"
            onClick={handleToggle}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            sx={{
              bgcolor: "action.hover",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            {expanded ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>

      {/* Nav */}
      <List sx={{ px: showFull ? 1.5 : 0.75, py: 2, flex: 1, overflow: "auto" }} disablePadding>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href === "/" && pathname === "/");
          return (
            <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={href}
                title={label}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  px: showFull ? 1.5 : 1,
                  justifyContent: showFull ? "flex-start" : "center",
                  position: "relative",
                  minHeight: 44,
                  ...(active
                    ? {
                        backgroundColor: alpha(accent, isDark ? 0.25 : 0.12),
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 4,
                          height: "60%",
                          borderRadius: "4px 0 0 4px",
                          bgcolor: accent,
                        },
                        "& .MuiListItemIcon-root": { color: accent },
                        "& .MuiListItemText-primary": { color: accent, fontWeight: 600 },
                      }
                    : {
                        color: "text.secondary",
                        "&:hover": {
                          bgcolor: "action.hover",
                          "& .MuiListItemIcon-root": { color: "text.primary" },
                        },
                      }),
                }}
              >
                <ListItemIcon sx={{ minWidth: showFull ? 40 : 0, justifyContent: "center", mr: showFull ? 1 : 0 }}>
                  <Icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: "0.9375rem" }}
                  sx={{ display: showFull ? "block" : "none" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Upgrade card */}
      <Box sx={{ px: showFull ? 2 : 1, pb: 2 }}>
        <Box
          sx={{
            borderRadius: 2,
            p: showFull ? 2 : 1,
            background: `linear-gradient(135deg, ${accent}, ${accentLight})`,
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5, lineHeight: 1.4, display: showFull ? "block" : "none" }}>
            Transform Data into Insight with AI
          </Typography>
          <Button
            fullWidth
            variant="contained"
            size="small"
            startIcon={<WorkspacePremiumIcon sx={{ fontSize: 18, mr: showFull ? 0.5 : 0 }} />}
            sx={{
              bgcolor: "rgba(255,255,255,0.95)",
              color: accent,
              fontWeight: 600,
              minWidth: showFull ? "auto" : 0,
              px: showFull ? 2 : 1,
              "&:hover": { bgcolor: "#fff" },
            }}
          >
            <Box component="span" sx={{ display: showFull ? "inline" : "none" }}>Upgrade Pro</Box>
          </Button>
        </Box>
      </Box>

      {/* User profile */}
      <Box
        sx={{
          p: showFull ? 1.5 : 1,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: alpha(theme.palette.action.hover, 0.3),
        }}
      >
        <Box
          component={Link}
          href="/profile"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: showFull ? "flex-start" : "center",
            gap: 1.5,
            p: 1,
            borderRadius: 2,
            textDecoration: "none",
            color: "text.primary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "0.875rem",
              flexShrink: 0,
            }}
          >
            TW
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, display: showFull ? "block" : "none" }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              Teja Williams
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              View profile
            </Typography>
          </Box>
          <KeyboardArrowRightIcon sx={{ fontSize: 20, color: "text.secondary", display: showFull ? "block" : "none" }} />
        </Box>
      </Box>
    </Box>
  );
}

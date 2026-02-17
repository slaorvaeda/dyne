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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import InsightsIcon from "@mui/icons-material/Insights";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PublicIcon from "@mui/icons-material/Public";

const STORAGE_KEY = "sidebarExpanded";

const navItems = [
  { label: "Dashboard", href: "/", icon: DashboardOutlinedIcon },
  { label: "Trends", href: "/trends", icon: TrendingUpIcon },
  { label: "Products", href: "/products", icon: ShoppingBagOutlinedIcon },
  { label: "Regions", href: "/regions", icon: PublicIcon },
  { label: "Notifications", href: "/notifications", icon: NotificationsOutlinedIcon },
  { label: "Help Center", href: "/help", icon: HelpOutlineIcon },
  { label: "Settings", href: "/settings", icon: SettingsOutlinedIcon },
];

export default function Sidebar({ inDrawer = false, onClose }) {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width:960px)");
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

  const showFull = inDrawer ? true : (mounted ? (isDesktop && expanded) : true);
  const sidebarWidth = inDrawer ? 280 : (mounted ? (isDesktop ? (expanded ? 280 : 72) : 72) : 280);
  const theme = useTheme();

  return (
    <Box
      component="aside"
      sx={{
        ...(inDrawer
          ? { width: "100%", minWidth: "100%", height: "100%", flexShrink: 0 }
          : {
              position: "sticky",
              top: 0,
              alignSelf: "flex-start",
              height: "100vh",
              transition: "width 300ms ease-in-out",
            }),
        width: inDrawer ? "100%" : sidebarWidth,
        minWidth: inDrawer ? "100%" : sidebarWidth,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        ...(!inDrawer && { borderRight: "1px solid", borderColor: "divider" }),
      }}
    >
      {/* Brand + Toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          minHeight: 64,
          ...(showFull
            ? { flexDirection: "row", justifyContent: "space-between", p: 2, gap: 1 }
            : { flexDirection: "column", justifyContent: "center", p: 1.5, gap: 1 }),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0,
            flex: showFull ? 1 : "none",
            ...(showFull ? { justifyContent: "flex-start" } : { justifyContent: "center", width: "100%" }),
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.contrastText",
              flexShrink: 0,
              bgcolor: "primary.main",
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            }}
          >
            <InsightsIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              letterSpacing: "-0.02em",
              display: showFull ? "block" : "none",
            }}
          >
            Analytics
          </Typography>
        </Box>
        {showFull && (
          <Box
            component="button"
            type="button"
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              border: "none",
              bgcolor: "action.hover",
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <StackedBarChartIcon sx={{ fontSize: 18 }} />
          </Box>
        )}
        {inDrawer && onClose ? (
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close menu"
            sx={{
              flexShrink: 0,
              bgcolor: "action.hover",
              color: "text.primary",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : (
          isDesktop && (
            <IconButton
              size="small"
              onClick={handleToggle}
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
              sx={{
                flexShrink: 0,
                bgcolor: "action.hover",
                color: "text.primary",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              {expanded ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
            </IconButton>
          )
        )}
      </Box>

      <List sx={{ flex: 1, overflow: "auto", py: 2, px: showFull ? 1.5 : 0.75 }} disablePadding>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href === "/" && pathname === "/");
          return (
            <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={href}
                title={label}
                selected={active}
                onClick={inDrawer && onClose ? onClose : undefined}
                sx={{
                  borderRadius: 2,
                  minHeight: 44,
                  color: "text.secondary",
                  ...(showFull ? { py: 1.25, px: 1.5, justifyContent: "flex-start" } : { py: 1.25, px: 1, justifyContent: "center" }),
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                  },
                  "&.Mui-selected": {
                    color: "primary.main",
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: showFull ? 40 : 0, justifyContent: "center", mr: showFull ? 1 : 0, color: "inherit" }}>
                  <Icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: "0.9375rem", fontWeight: active ? 600 : 400 }}
                  sx={{ display: showFull ? "block" : "none" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ pb: 2, px: showFull ? 2 : 1 }}>
        <Box
          sx={{
            borderRadius: 2,
            p: 2,
            textAlign: "center",
            color: "white",
            bgcolor: "primary.main",
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
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
              color: "primary.main",
              fontWeight: 600,
              minWidth: showFull ? "auto" : 0,
              px: showFull ? 2 : 1,
              "&:hover": { bgcolor: "#fff" },
            }}
          >
            <Box component="span" sx={{ display: showFull ? "inline" : "none" }}>
              Upgrade Pro
            </Box>
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 1.5, borderTop: "1px solid", borderColor: "divider", bgcolor: "action.hover" }}>
        <Box
          component={Link}
          href="/profile"
          onClick={inDrawer && onClose ? onClose : undefined}
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "text.primary",
            p: 1,
            borderRadius: 2,
            "&:hover": { bgcolor: "action.selected" },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "0.875rem",
              flexShrink: 0,
            }}
          >
            DN
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, display: showFull ? "block" : "none" }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              Durga Nayak
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap display="block">
              View profile
            </Typography>
          </Box>
          <KeyboardArrowRightIcon sx={{ fontSize: 20, color: "text.secondary", display: showFull ? "block" : "none" }} />
        </Box>
      </Box>
    </Box>
  );
}

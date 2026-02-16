"use client";

import Link from "next/link";
import { Box, Container, Typography, IconButton, Grid } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const productLinks = [
  { label: "Dashboard", href: "/" },
  { label: "Analytics", href: "/analytics" },
  { label: "Reports", href: "/performance" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
];

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Cookies", href: "#" },
];

const socials = [
  { icon: LinkedInIcon, href: "#", label: "LinkedIn" },
  { icon: GitHubIcon, href: "#", label: "GitHub" },
  { icon: ShareOutlinedIcon, href: "#", label: "Share" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderRadius: "24px 24px 0 0",
        overflow: "hidden",
        borderTop: "1px solid",
        borderColor: "divider",
        position: "relative",
        bgcolor: "background.paper",
        background: (t) =>
          t.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
            : "linear-gradient(180deg, rgba(59, 130, 246, 0.06) 0%, transparent 100%)",
      }}
    >
      <Box
        sx={(t) => ({
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.primary.light})`,
          opacity: 0.8,
        })}
        aria-hidden
      />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 }, px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box className="flex items-center gap-3 mb-4">
              <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: "primary.main", color: "primary.contrastText", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <InsightsIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Sales Analytics
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, mb: 2 }}>
              Turn data into decisions. Real-time sales and revenue insights for your business.
            </Typography>
            <Box className="flex gap-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{ color: "text.secondary", "&:hover": { color: "primary.main", bgcolor: "action.hover" } }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="overline" fontWeight={600} color="text.secondary" sx={{ letterSpacing: 2, mb: 1.5, display: "block" }}>
              Product
            </Typography>
            {productLinks.map(({ label, href }) => (
              <Typography
                key={label}
                component={Link}
                href={href}
                variant="body2"
                color="text.secondary"
                sx={{ display: "block", mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                {label}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="overline" fontWeight={600} color="text.secondary" sx={{ letterSpacing: 2, mb: 1.5, display: "block" }}>
              Company
            </Typography>
            {companyLinks.map(({ label, href }) => (
              <Typography
                key={label}
                component={Link}
                href={href}
                variant="body2"
                color="text.secondary"
                sx={{ display: "block", mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                {label}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="overline" fontWeight={600} color="text.secondary" sx={{ letterSpacing: 2, mb: 1.5, display: "block" }}>
              Legal
            </Typography>
            {legalLinks.map(({ label, href }) => (
              <Typography
                key={label}
                component={Link}
                href={href}
                variant="body2"
                color="text.secondary"
                sx={{ display: "block", mb: 1, textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                {label}
              </Typography>
            ))}
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, mt: 4, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Dyne Infotech. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              component="a"
              href="mailto:hello@example.com"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 0.5, "&:hover": { color: "primary.main" } }}
            >
              <EmailOutlinedIcon sx={{ fontSize: 18 }} />
              Contact
            </Typography>
            <IconButton
              onClick={scrollToTop}
              aria-label="Back to top"
              sx={{ bgcolor: "action.hover", color: "primary.main", "&:hover": { bgcolor: "action.selected" } }}
            >
              <KeyboardArrowUpIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

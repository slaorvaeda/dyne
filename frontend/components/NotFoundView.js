"use client";

import Link from "next/link";
import { Box, Typography, Button, useTheme } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import HomeIcon from "@mui/icons-material/Home";

const keyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(2deg); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.6; filter: blur(40px); }
    50% { opacity: 1; filter: blur(60px); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes chart-drop {
    0% { stroke-dashoffset: 0; opacity: 1; }
    70% { stroke-dashoffset: 0; opacity: 1; }
    85% { stroke-dashoffset: 400; opacity: 0.8; }
    100% { stroke-dashoffset: 400; opacity: 0.3; }
  }
  @keyframes number-shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-2px); }
    80% { transform: translateX(2px); }
  }
  @keyframes bar-fall {
    0% { transform: scaleY(1); opacity: 1; }
    50% { transform: scaleY(0.3); opacity: 0.8; }
    100% { transform: scaleY(0); opacity: 0.4; }
  }
  @keyframes coin-spin {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.9; }
    100% { transform: translateY(-80px) rotate(360deg); opacity: 0; }
  }
`;

export default function NotFoundView() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const bg = theme.palette.background.default;
  const paper = theme.palette.background.paper;
  const textSecondary = theme.palette.text.secondary;

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        py: 6,
        px: 2,
        "& .nf-keyframes": { position: "absolute", width: 0, height: 0, overflow: "hidden" },
      }}
    >
      <style>{keyframes}</style>

      {/* glow */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primary}22 0%, transparent 70%)`,
          animation: "pulse-glow 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* chart line */}
      <Box
        sx={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: 280,
          height: 80,
          opacity: 0.35,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 280 80" fill="none" style={{ overflow: "visible" }}>
          <path
            d="M 0 20 Q 70 10, 140 25 T 280 15 L 280 80 L 0 80 Z"
            fill={primary}
            fillOpacity={0.15}
            style={{
              animation: "chart-drop 5s ease-in-out infinite",
              transformOrigin: "center bottom",
            }}
          />
          <path
            d="M 0 20 Q 70 10, 140 25 T 280 15"
            stroke={primary}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="400"
            strokeDashoffset="0"
            style={{
              animation: "chart-drop 5s ease-in-out infinite",
            }}
          />
        </svg>
      </Box>

      {/* decor */}
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            bottom: `${20 + i * 25}%`,
            left: `${15 + i * 30}%`,
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: `2px solid ${primary}`,
            opacity: 0.25,
            animation: "float 3s ease-in-out infinite",
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      {/* 404 content */}
      <Box
        sx={{
          position: "relative",
          animation: "slide-up 0.8s ease-out",
          zIndex: 1,
        }}
      >
        <Typography
          component="span"
          sx={{
            display: "inline-block",
            fontSize: { xs: "clamp(4rem, 18vw, 10rem)", md: "clamp(6rem, 12vw, 11rem)" },
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            background: `linear-gradient(135deg, ${primary} 0%, ${theme.palette.primary.light} 50%, ${primary} 100%)`,
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "number-shake 3s ease-in-out infinite",
          }}
        >
          404
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, animation: "slide-up 0.8s ease-out 0.15s both" }}>
        <TrendingDownIcon sx={{ color: "primary.main", fontSize: 28 }} />
        <Typography variant="h6" color="text.secondary" fontWeight={600}>
          This page isn&apos;t in the pipeline
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 360, animation: "slide-up 0.8s ease-out 0.25s both" }}>
        The deal you&apos;re looking for doesn&apos;t exist. Head back to the dashboard to track real revenue.
      </Typography>

      <Button
        component={Link}
        href="/"
        variant="contained"
        size="large"
        startIcon={<HomeIcon />}
        sx={{
          mt: 4,
          px: 3,
          py: 1.5,
          borderRadius: "9999px",
          textTransform: "none",
          fontWeight: 700,
          boxShadow: 2,
          animation: "slide-up 0.8s ease-out 0.35s both",
          "&:hover": { boxShadow: 4 },
        }}
      >
        Back to Dashboard
      </Button>

      {/* bar chart */}
      <Box
        sx={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "flex-end",
          gap: 0.75,
          height: 40,
          opacity: 0.2,
        }}
      >
        {[0.9, 0.7, 0.85, 0.5, 0.3, 0.1, 0].map((scale, i) => (
          <Box
            key={i}
            sx={{
              width: 12,
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: `${scale * 100}%`,
                bgcolor: "primary.main",
                borderRadius: "4px 4px 0 0",
                transformOrigin: "bottom",
                animation: "bar-fall 2.5s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

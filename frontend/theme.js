import { createTheme } from "@mui/material/styles";

// blue accent, gray neutrals
const lightPalette = {
  primary: { main: "#3b82f6", light: "#60a5fa", dark: "#2563eb" },
  background: { default: "#f8fafc", paper: "#ffffff" },
  divider: "#e5e7eb",
};

const darkPalette = {
  primary: { main: "#3b82f6", light: "#60a5fa", dark: "#2563eb" },
  background: { default: "#111827", paper: "#1f2937" },
  divider: "#374151",
};

export const getTheme = (mode) =>
  createTheme({
    typography: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
    palette: {
      mode,
      ...(mode === "dark" ? darkPalette : lightPalette),
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "2rem",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            "&.Mui-selected": {
              backgroundColor: theme.palette.mode === "dark" ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)",
              color: theme.palette.primary.main,
              borderRight: `4px solid ${theme.palette.primary.main}`,
              "&:hover": {
                backgroundColor: theme.palette.mode === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)",
              },
            },
          }),
        },
      },
    },
  });

export default getTheme("light");

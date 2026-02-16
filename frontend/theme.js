import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#1976d2" },
      ...(mode === "dark"
        ? {
            background: { default: "#121212", paper: "#1e1e1e" },
            divider: "rgba(255,255,255,0.12)",
          }
        : {
            background: { default: "#f5f5f5", paper: "#ffffff" },
          }),
    },
  });

export default getTheme("light");

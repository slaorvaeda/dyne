"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "@/theme";
import { ThemeModeProvider, useThemeMode } from "@/context/ThemeModeContext";

function ThemeWrapper({ children }) {
  const { mode } = useThemeMode();
  const theme = getTheme(mode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function Providers({ children }) {
  return (
    <ThemeModeProvider>
      <ThemeWrapper>{children}</ThemeWrapper>
    </ThemeModeProvider>
  );
}

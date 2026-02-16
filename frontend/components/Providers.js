"use client";

import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getTheme } from "@/theme";
import { ThemeModeProvider, useThemeMode } from "@/context/ThemeModeContext";
import ThemeSync from "@/components/ThemeSync";
import { store } from "@/store";

function ThemeWrapper({ children }) {
  const { mode } = useThemeMode();
  const theme = getTheme(mode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeSync />
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeModeProvider>
        <ThemeWrapper>{children}</ThemeWrapper>
      </ThemeModeProvider>
    </Provider>
  );
}

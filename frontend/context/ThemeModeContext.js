"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ThemeModeContext = createContext({ mode: "light", toggleMode: () => {} });

export function ThemeModeProvider({ children, initialMode = "light" }) {
  const [mode, setMode] = useState(initialMode);
  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);
  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return ctx;
}

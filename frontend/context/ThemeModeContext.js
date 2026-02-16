"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "theme-mode";
const ThemeModeContext = createContext({ mode: "light", toggleMode: () => {} });

export function ThemeModeProvider({ children, initialMode = "light" }) {
  const [mode, setMode] = useState(initialMode);

  // Hydrate from localStorage so toggle state persists across reloads
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") setMode(stored);
    } catch (_) {}
  }, []);

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

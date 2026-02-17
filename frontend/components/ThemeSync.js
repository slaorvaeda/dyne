"use client";

import { useEffect } from "react";
import { useThemeMode } from "@/context/ThemeModeContext";

const STORAGE_KEY = "theme-mode";

// sync theme to <html> for Tailwind dark:
export default function ThemeSync() {
  const { mode } = useThemeMode();

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (_) {}
  }, [mode]);

  return null;
}

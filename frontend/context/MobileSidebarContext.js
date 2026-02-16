"use client";

import { createContext, useContext, useState, useCallback } from "react";

const MobileSidebarContext = createContext(null);

export function MobileSidebarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);
  const toggleSidebar = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <MobileSidebarContext.Provider value={{ open, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebar() {
  const ctx = useContext(MobileSidebarContext);
  if (!ctx) return { open: false, openSidebar: () => {}, closeSidebar: () => {}, toggleSidebar: () => {} };
  return ctx;
}

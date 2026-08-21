"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettingsData } from "@/types";

const SettingsContext = createContext<SiteSettingsData | null>(null);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettingsData;
  children: ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

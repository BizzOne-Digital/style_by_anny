"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import type { SiteSettingsData } from "@/types";

interface PublicShellProps {
  settings: SiteSettingsData;
  children: React.ReactNode;
}

export function PublicShell({ settings, children }: PublicShellProps) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <SettingsProvider settings={settings}>
      <ToastProvider>
        <Header settings={settings} onCartOpen={() => setCartOpen(true)} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          currency={settings.currency}
        />
      </ToastProvider>
    </SettingsProvider>
  );
}

"use client";

import { createContext, useContext, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminToastProvider } from "./AdminToast";

interface SidebarContextValue {
  openSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  openSidebar: () => {},
});

export function useAdminSidebar() {
  return useContext(SidebarContext);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminToastProvider>
      <SidebarContext.Provider value={{ openSidebar: () => setSidebarOpen(true) }}>
        <div className="flex min-h-screen bg-[#FAF8F5]">
          <AdminSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <div className="flex min-h-screen flex-1 flex-col">{children}</div>
        </div>
      </SidebarContext.Provider>
    </AdminToastProvider>
  );
}

export function AdminLoginShell({ children }: { children: React.ReactNode }) {
  return <AdminToastProvider>{children}</AdminToastProvider>;
}

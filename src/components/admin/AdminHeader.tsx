"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useAdminSidebar } from "./AdminShell";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface AdminUser {
  name?: string;
  email?: string;
}

export function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  const { openSidebar } = useAdminSidebar();
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setAdmin(json.data);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[#E8E0F0] bg-white">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={openSidebar}
            className="rounded-lg p-2 hover:bg-[#E8E0F0] lg:hidden"
          >
            <Menu className="h-5 w-5 text-[#4A2C6E]" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#2D2D2D]">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {actions}
          {admin && (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-[#2D2D2D]">
                {admin.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">{admin.email}</p>
            </div>
          )}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4A2C6E] text-sm font-bold text-white">
            {(admin?.name || "A").charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

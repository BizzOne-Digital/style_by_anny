"use client";

import { usePathname } from "next/navigation";
import { AdminShell, AdminLoginShell } from "@/components/admin/AdminShell";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <AdminLoginShell>{children}</AdminLoginShell>;
  }

  return <AdminShell>{children}</AdminShell>;
}

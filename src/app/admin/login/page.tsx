"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Loader2 } from "lucide-react";
import { useAdminToast } from "@/components/admin/AdminToast";

export default function AdminLoginPage() {
  const router = useRouter();
  const toast = useAdminToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Invalid credentials");
      }

      toast.success("Welcome back!");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4A2C6E]">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#2D2D2D]">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-500">
            Plant Style by Anne
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E8E0F0] bg-white p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#2D2D2D]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#4A2C6E] focus:outline-none focus:ring-1 focus:ring-[#4A2C6E]"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#2D2D2D]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#4A2C6E] focus:outline-none focus:ring-1 focus:ring-[#4A2C6E]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4A2C6E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3d2459] disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

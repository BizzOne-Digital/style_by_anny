import { getSiteSettings } from "@/lib/data";
import { PublicShell } from "@/components/layout/PublicShell";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return <PublicShell settings={settings}>{children}</PublicShell>;
}

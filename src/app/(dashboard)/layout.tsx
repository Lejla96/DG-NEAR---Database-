import { getAuthenticatedAdmin } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await getAuthenticatedAdmin();

  return <DashboardShell admin={admin}>{children}</DashboardShell>;
}

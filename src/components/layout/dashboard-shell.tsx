"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Database, FileSpreadsheet, Languages, LogOut, MenuSquare } from "lucide-react";
import { useMemo, useState } from "react";

import { signOutAction } from "@/app/actions";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { APP_LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AuthenticatedAdmin } from "@/lib/types";
import type { Route } from "next";

const navItems = [
  { href: "/dashboard", icon: BarChart3, labelKey: "nav.dashboard" as const },
  { href: "/entrepreneurs", icon: Database, labelKey: "nav.entrepreneurs" as const },
  { href: "/import-export", icon: FileSpreadsheet, labelKey: "nav.importExport" as const },
] satisfies Array<{
  href: Route;
  icon: typeof BarChart3;
  labelKey: "nav.dashboard" | "nav.entrepreneurs" | "nav.importExport";
}>;

type DashboardShellProps = {
  children: React.ReactNode;
  admin: AuthenticatedAdmin;
};

export function DashboardShell({ children, admin }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const initials = useMemo(() => {
    const name = admin.full_name?.trim();
    if (name) {
      return name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
    }

    return admin.email.slice(0, 2).toUpperCase();
  }, [admin.email, admin.full_name]);

  return (
    <div className="dashboard-shell">
      <aside className={cn("dashboard-sidebar", mobileOpen && "dashboard-sidebar-open")}>
        <div className="sidebar-brand">
          <div className="brand-mark">DG</div>
          <div>
            <p className="sidebar-eyebrow">European Union / NGO</p>
            <h2>{t["app.title"]}</h2>
            <p className="sidebar-subtitle">{t["app.subtitle"]}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("sidebar-link", active && "sidebar-link-active")}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                <span>{t[item.labelKey]}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-chip">
            <div className="profile-avatar">{initials}</div>
            <div>
              <strong>{admin.full_name ?? "Admin"}</strong>
              <span>{admin.email}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <button
              type="button"
              className="mobile-nav-toggle"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((current) => !current)}
            >
              <MenuSquare size={18} />
            </button>
            <div>
              <p className="sidebar-eyebrow">{t["dashboard.overview"]}</p>
              <h1>{admin.full_name ?? admin.email}</h1>
            </div>
          </div>

          <div className="dashboard-topbar-right">
            <label className="language-picker">
              <Languages size={16} />
              <select
                value={language}
                aria-label={t["app.language"]}
                onChange={(event) =>
                  setLanguage(event.target.value === "mk" ? "mk" : "en")
                }
              >
                {APP_LANGUAGES.map((language) => (
                  <option key={language} value={language}>
                    {language === "en" ? "English" : "Македонски"}
                  </option>
                ))}
              </select>
            </label>

            <form action={signOutAction}>
              <Button type="submit" variant="ghost">
                <LogOut size={16} />
                {t["auth.signOut"]}
              </Button>
            </form>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

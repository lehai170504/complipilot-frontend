"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { appNavigationItems } from "@/components/layout/app-navigation";
import { WorkspaceSelector } from "@/components/layout/workspace-selector";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

function getPlatformAdminEmails() {
  return (process.env.NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function AppSidebar() {
  const pathname = usePathname();

  const tBrand = useTranslations("brand");
  const tNavigation = useTranslations("navigation");
  const tSidebar = useTranslations("sidebar");

  const { canViewAudit } = useActiveOrganization();
  const currentUserQuery = useCurrentUserQuery();

  const currentUserEmail = currentUserQuery.data?.email?.toLowerCase();
  const platformAdminEmails = getPlatformAdminEmails();
  const canViewPlatformAdmin =
    Boolean(currentUserEmail) &&
    platformAdminEmails.includes(currentUserEmail!);

  const visibleNavigationItems = appNavigationItems.filter((item) => {
    if (item.permission === "canViewAudit") {
      return canViewAudit;
    }

    if (item.permission === "canViewPlatformAdmin") {
      return canViewPlatformAdmin;
    }

    return true;
  });

  return (
    <aside className="hidden h-screen w-72 shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="relative p-5">
        <div className="absolute -right-16 -top-16 size-32 rounded-full bg-sidebar-primary/10 blur-3xl" />

        <Link className="relative flex items-center gap-3" href="/dashboard">
          <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-sidebar-primary/20 to-sidebar-primary/10 text-sidebar-primary ring-1 ring-sidebar-primary/20">
            <ShieldCheck className="size-5" />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight">
              {tBrand("name")}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-sidebar-foreground/50">
              {tBrand("shortDescription")}
            </p>
          </div>
        </Link>
      </div>

      <div className="px-5">
        <WorkspaceSelector />
      </div>

      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {visibleNavigationItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive &&
                  "bg-linear-to-r from-sidebar-primary/10 to-transparent text-sidebar-primary ring-1 ring-sidebar-primary/10",
              )}
              href={item.href}
              key={item.href}
            >
              <item.icon
                className={cn(
                  "size-4",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50",
                )}
              />
              {tNavigation(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 p-5">
        <div className="rounded-2xl border border-sidebar-primary/10 bg-linear-to-br from-sidebar-primary/5 to-transparent p-4">
          <p className="text-sm font-semibold text-sidebar-primary">
            {tSidebar("mvpTitle")}
          </p>
          <p className="mt-2 text-xs leading-5 text-sidebar-foreground/60">
            {tSidebar("mvpDescription")}
          </p>
        </div>
      </div>
    </aside>
  );
}

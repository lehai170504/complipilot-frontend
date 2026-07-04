"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { appNavigationGroups } from "@/components/layout/app-navigation";
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

  const { canViewAudit, canManageBilling } = useActiveOrganization();
  const currentUserQuery = useCurrentUserQuery();

  const currentUserEmail = currentUserQuery.data?.email?.toLowerCase();
  const platformAdminEmails = getPlatformAdminEmails();
  const canViewPlatformAdmin =
    Boolean(currentUserEmail) &&
    platformAdminEmails.includes(currentUserEmail!);

  return (
    <aside className="hidden h-screen w-72 shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="relative p-5 pb-0">
        <div className="absolute -right-16 -top-16 size-32 rounded-full bg-sidebar-primary/10 blur-3xl pointer-events-none" />

        <Link className="relative flex items-center gap-3 group" href="/dashboard">
          <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-sidebar-primary/20 to-sidebar-primary/5 text-sidebar-primary ring-1 ring-sidebar-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-sidebar-primary/20">
            <ShieldCheck className="size-5 transition-transform duration-300 group-hover:rotate-12" />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
              {tBrand("name")}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sidebar-foreground/50">
              {tBrand("shortDescription")}
            </p>
          </div>
        </Link>
      </div>

      <div className="px-5 py-6">
        <WorkspaceSelector />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {appNavigationGroups.map((group, index) => {
          const visibleItems = group.items.filter((item) => {
            if (item.permission === "canViewAudit") return canViewAudit;
            if (item.permission === "canManageBilling") return canManageBilling;
            if (item.permission === "canViewPlatformAdmin") return canViewPlatformAdmin;
            return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={index} className="space-y-1.5">
              {group.groupLabelKey && (
                <p className="px-3 pb-2 pt-2 text-[11px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
                  {tNavigation(group.groupLabelKey as any)}
                </p>
              )}

              {visibleItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent shadow-sm text-sidebar-primary"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -mt-2.5 h-5 w-1 rounded-r-full bg-sidebar-primary shadow-[0_0_8px_var(--color-primary)] opacity-80" />
                    )}
                    <item.icon
                      className={cn(
                        "size-4 transition-colors duration-200",
                        isActive
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70",
                      )}
                    />
                    {tNavigation(item.labelKey as any)}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 p-5 pt-0">
        <div className="relative overflow-hidden rounded-2xl border border-sidebar-primary/20 bg-linear-to-br from-sidebar-primary/10 to-transparent p-4 transition-colors hover:border-sidebar-primary/40">
          <div className="absolute -right-4 -top-4 size-16 rounded-full bg-sidebar-primary/20 blur-2xl pointer-events-none" />
          <p className="relative z-10 text-sm font-bold text-sidebar-primary flex items-center gap-2">
            {tSidebar("mvpTitle")}
          </p>
          <p className="relative z-10 mt-1.5 text-xs font-medium leading-relaxed text-sidebar-foreground/60">
            {tSidebar("mvpDescription")}
          </p>
        </div>
      </div>
    </aside>
  );
}

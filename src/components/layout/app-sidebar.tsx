"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { getVisibleNavigationGroups } from "@/components/layout/app-navigation";
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
  const visibleNavigationGroups = getVisibleNavigationGroups({
    canViewAudit,
    canManageBilling,
    canViewPlatformAdmin,
  });

  return (
    <aside className="hidden h-dvh w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="px-5 pb-5 pt-6">
        <Link className="group flex items-center gap-3" href="/dashboard">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-sidebar-foreground">
              {tBrand("name")}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
              {tBrand("shortDescription")}
            </p>
          </div>
        </Link>
      </div>

      <div className="px-4 pb-5">
        <WorkspaceSelector />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-5">
        {visibleNavigationGroups.map((group) => (
          <div
            key={group.groupLabelKey ?? group.items[0]?.href}
            className="space-y-1"
          >
            {group.groupLabelKey ? (
              <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/40">
                {tNavigation(group.groupLabelKey)}
              </p>
            ) : null}

            {group.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <item.icon
                    className={cn(
                      "size-4 transition-colors",
                      isActive
                        ? "text-sidebar-primary"
                        : "text-sidebar-foreground/45 group-hover:text-sidebar-foreground/75",
                    )}
                  />
                  {tNavigation(item.labelKey)}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent/60 p-3">
          <p className="text-xs font-semibold text-sidebar-primary">
            {tSidebar("mvpTitle")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-sidebar-foreground/55">
            {tSidebar("mvpDescription")}
          </p>
        </div>
      </div>
    </aside>
  );
}

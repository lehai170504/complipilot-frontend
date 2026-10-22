"use client";

import {
  LogOut,
  Menu,
  ChevronDown,
  UserCircle,
  Settings,
  Crown,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { GlobalSearch } from "@/components/layout/global-search";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/hooks/auth-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { OrganizationUsageDialog } from "@/features/billing/components/organization-usage-dialog";
import { ProfileModal } from "@/features/profile/components/profile-modal";
import { SettingsModal } from "@/features/organizations/components/settings-modal";
import { UpgradePlanModal } from "@/features/billing/components/upgrade-plan-modal";
import { getVisibleNavigationGroups } from "@/components/layout/app-navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function AppTopbar({
  organizationId,
}: {
  organizationId?: string;
}) {
  const {
    activeOrganization,
    canViewAudit,
    canManageBilling,
    canManageMembers,
  } = useActiveOrganization();
  const currentUserQuery = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const pathname = usePathname();

  const tTopbar = useTranslations("topbar");
  const tAuth = useTranslations("auth");
  const tBrand = useTranslations("brand");
  const tNavigation = useTranslations("navigation");
  const tWorkspace = useTranslations("workspace");
  const tStatus = useTranslations("status");
  const currentUserEmail = currentUserQuery.data?.email?.toLowerCase();
  const canViewPlatformAdmin =
    Boolean(currentUserEmail) &&
    (process.env.NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .includes(currentUserEmail ?? "");
  const mobileNavigationGroups = getVisibleNavigationGroups({
    canViewAudit,
    canManageBilling,
    canViewPlatformAdmin,
  });

  return (
    <>
    <header className="z-20 shrink-0 border-b border-border bg-card px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex min-h-10 items-center gap-3">
        <div className="flex items-center gap-3">
          <Button
            aria-label={tTopbar("openNavigation")}
            className="lg:hidden"
            size="icon"
            variant="ghost"
            onClick={() => setIsMobileNavigationOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          <div className="hidden flex-col justify-center sm:flex">
            <p className="mb-1 text-[10px] font-semibold uppercase leading-none tracking-[0.12em] text-muted-foreground">
              {tTopbar("workspace")}
            </p>
            <h1 className="text-sm font-semibold leading-none tracking-tight text-foreground">
              {tTopbar("title")}
            </h1>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 justify-center md:flex-none md:px-4">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block">
            <OrganizationUsageDialog organizationId={organizationId} />
          </div>
          <NotificationBell organizationId={organizationId} />

          <LanguageSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg p-1.5 pr-2 transition-colors hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-primary sm:pr-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserCircle className="size-5" />
                </div>
                <div className="hidden flex-col items-start gap-1 text-left sm:flex">
                  <p className="max-w-40 truncate text-sm font-semibold leading-none text-foreground">
                    {currentUserQuery.data?.fullName ?? tTopbar("loadingUser")}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUserQuery.data?.email}
                  </p>
                </div>
                <ChevronDown className="hidden size-4 text-muted-foreground sm:block ml-2" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                <UserCircle className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
              {canManageMembers ? (
                <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                  <Settings className="mr-2 size-4" />
                  Workspace Settings
                </DropdownMenuItem>
              ) : null}
              {canManageBilling ? (
                <DropdownMenuItem onClick={() => setIsUpgradeModalOpen(true)}>
                  <Crown className="mr-2 size-4 text-amber-500" />
                  <span className="font-medium text-amber-600">Upgrade Plan</span>
                </DropdownMenuItem>
              ) : null}
              {canManageMembers || canManageBilling ? (
                <DropdownMenuSeparator />
              ) : null}
              <DropdownMenuItem
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="mr-2 size-4" />
                {tAuth("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ProfileModal open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} />
          <SettingsModal open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen} />

          <UpgradePlanModal open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen} />
        </div>
      </div>
    </header>
    <Dialog open={isMobileNavigationOpen} onOpenChange={setIsMobileNavigationOpen}>
      <DialogContent
        className="left-0 top-0 h-dvh max-h-dvh w-[min(19rem,88vw)] max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none border-0 bg-sidebar p-0 text-sidebar-foreground"
        showCloseButton
      >
        <DialogTitle className="sr-only">{tTopbar("openNavigation")}</DialogTitle>
        <div className="border-b border-sidebar-border px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold">{tBrand("name")}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">
                {tBrand("shortDescription")}
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
            <p className="text-xs font-semibold text-sidebar-foreground">
              {activeOrganization?.organizationName ?? tWorkspace("noWorkspace")}
            </p>
            {activeOrganization ? (
              <p className="mt-1 text-[10px] uppercase tracking-wider text-sidebar-foreground/55">
                {tStatus(activeOrganization.role)}
              </p>
            ) : null}
          </div>
        </div>
        <nav className="space-y-6 px-3 py-5">
          {mobileNavigationGroups.map((group) => (
            <div key={group.groupLabelKey ?? group.items[0]?.href}>
              {group.groupLabelKey ? (
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/40">
                  {tNavigation(group.groupLabelKey)}
                </p>
              ) : null}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60"
                      }`}
                      href={item.href}
                      key={item.href}
                      onClick={() => setIsMobileNavigationOpen(false)}
                    >
                      <item.icon className="size-4" />
                      {tNavigation(item.labelKey)}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </DialogContent>
    </Dialog>
    </>
  );
}
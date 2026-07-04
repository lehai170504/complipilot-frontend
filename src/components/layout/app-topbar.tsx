"use client";

import {
  LogOut,
  Menu,
  ChevronDown,
  UserCircle,
  Settings,
  Crown,
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

export function AppTopbar({
  organizationId,
}: {
  organizationId?: string;
}) {
  const { canManageBilling, canManageMembers } = useActiveOrganization();
  const currentUserQuery = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const tTopbar = useTranslations("topbar");
  const tAuth = useTranslations("auth");

  return (
    <header className="z-20 shrink-0 border-b border-border/50 bg-background/60 px-4 py-3 backdrop-blur-2xl xl:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button className="lg:hidden" size="icon" variant="outline">
            <Menu className="size-5" />
          </Button>

          <div className="flex flex-col justify-center">
            <p className="mb-0.5 text-[10px] font-semibold uppercase leading-none tracking-[0.1em] text-muted-foreground">
              {tTopbar("workspace")}
            </p>

            <h1 className="text-base font-bold leading-none tracking-tight text-foreground">
              {tTopbar("title")}
            </h1>
          </div>
        </div>

        <GlobalSearch />

        <div className="flex items-center gap-3">
          <OrganizationUsageDialog organizationId={organizationId} />
          <NotificationBell organizationId={organizationId} />

          <LanguageSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-full hover:bg-muted/50 p-1 pr-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserCircle className="size-5" />
                </div>
                <div className="hidden flex-col items-start gap-1 text-left sm:flex">
                  <p className="text-sm font-semibold leading-none text-foreground">
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

          {/* Placeholders for upcoming Modals */}
          <ProfileModal open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} />
          <SettingsModal open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen} />

          <UpgradePlanModal open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen} />
        </div>
      </div>
    </header>
  );
}
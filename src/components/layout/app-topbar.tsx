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

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {tTopbar("workspace")}
            </p>

            <h1 className="text-xl font-bold tracking-tight text-foreground">
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
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {currentUserQuery.data?.fullName ?? tTopbar("loadingUser")}
                  </p>
                  <p className="mt-1.5 text-xs leading-none text-muted-foreground">
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
              <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                <Settings className="mr-2 size-4" />
                Workspace Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsUpgradeModalOpen(true)}>
                <Crown className="mr-2 size-4 text-amber-500" />
                <span className="font-medium text-amber-600">Upgrade Plan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
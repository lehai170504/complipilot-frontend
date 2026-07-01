"use client";

import { LogOut, Menu, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { GlobalSearch } from "@/components/layout/global-search";
import { Button } from "@/components/ui/button";
import {
  useCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/hooks/auth-hooks";
import { NotificationBell } from "@/features/notifications/components/notification-bell";

export function AppTopbar({
  organizationId,
}: {
  organizationId?: string;
}) {
  const currentUserQuery = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation();

  const tTopbar = useTranslations("topbar");
  const tAuth = useTranslations("auth");

  return (
    <header className="z-20 shrink-0 border-b border-slate-200/50 bg-white/60 px-4 py-3 backdrop-blur-2xl dark:border-white/5 dark:bg-slate-950/60 xl:px-8">
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
          <NotificationBell organizationId={organizationId} />

          <LanguageSwitcher />

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">
              {currentUserQuery.data?.fullName ?? tTopbar("loadingUser")}
            </p>

            <p className="text-xs text-muted-foreground">
              {currentUserQuery.data?.email}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="text-muted-foreground hover:text-foreground"
            title={tAuth("logout")}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
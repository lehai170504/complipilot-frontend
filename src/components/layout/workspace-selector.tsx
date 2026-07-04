"use client";

import { Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

export function WorkspaceSelector() {
  const {
    activeOrganization,
    isLoading,
  } = useActiveOrganization();

  const tWorkspace = useTranslations("workspace");
  const tStatus = useTranslations("status");

  if (isLoading) {
    return (
      <div className="h-[52px] w-full animate-pulse rounded-xl bg-sidebar-accent/50" />
    );
  }

  if (!activeOrganization) {
    return (
      <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/20 p-3 text-sm text-sidebar-foreground/70">
        {tWorkspace("noWorkspace")}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/30 p-2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary shadow-sm ring-1 ring-sidebar-primary/20">
        <Building2 className="size-4" />
      </div>
      <div className="flex min-w-0 flex-col items-start text-left">
        <span className="block w-full truncate text-sm font-bold text-sidebar-foreground">
          {activeOrganization.organizationName}
        </span>
        <span className="block w-full truncate text-[11px] font-medium text-sidebar-foreground/60 mt-0.5 uppercase tracking-wider">
          {tStatus(activeOrganization.role)}
        </span>
      </div>
    </div>
  );
}
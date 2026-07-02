"use client";

import { Building2, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

export function WorkspaceSelector() {
  const {
    activeOrganization,
    organizations,
    isLoading,
    changeActiveOrganization,
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-auto w-full justify-between rounded-xl border border-sidebar-border bg-sidebar-accent/30 p-2 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground transition-all duration-200 group"
          variant="ghost"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary shadow-sm ring-1 ring-sidebar-primary/20 group-hover:bg-sidebar-primary/20 transition-colors">
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

          <ChevronsUpDown className="ml-2 size-4 shrink-0 text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70 transition-colors" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64 rounded-xl">
        <DropdownMenuRadioGroup
          value={activeOrganization.organizationId}
          onValueChange={changeActiveOrganization}
        >
          {organizations.map((organization) => (
            <DropdownMenuRadioItem
              key={organization.organizationId}
              value={organization.organizationId}
              className="rounded-lg cursor-pointer"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-sm">
                  {organization.organizationName}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {tStatus(organization.role)}
                </span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
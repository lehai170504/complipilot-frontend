"use client";

import { Building2, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
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
      <div className="h-11 w-full animate-pulse rounded-2xl bg-white/10" />
    );
  }

  if (!activeOrganization) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
        {tWorkspace("noWorkspace")}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-auto w-full justify-between rounded-2xl border border-white/10 bg-white/6 px-3 py-3 text-left text-white hover:bg-white/10 hover:text-white"
          variant="ghost"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-300">
              <Building2 className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {activeOrganization.organizationName}
              </span>
              <span className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <Badge className="h-5 rounded-full bg-cyan-300/15 px-2 text-[10px] text-cyan-200 hover:bg-cyan-300/15">
                  {tStatus(activeOrganization.role)}
                </Badge>
                {tStatus(activeOrganization.status)}
              </span>
            </span>
          </span>

          <ChevronsUpDown className="ml-2 size-4 shrink-0 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuRadioGroup
          value={activeOrganization.organizationId}
          onValueChange={changeActiveOrganization}
        >
          {organizations.map((organization) => (
            <DropdownMenuRadioItem
              key={organization.organizationId}
              value={organization.organizationId}
            >
              <span className="flex flex-col">
                <span className="font-medium">
                  {organization.organizationName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tStatus(organization.role)} · {tStatus(organization.status)}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
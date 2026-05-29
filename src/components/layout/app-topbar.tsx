"use client";

import { Menu, Search, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogoutMutation, useCurrentUserQuery } from "@/features/auth/hooks/auth-hooks";

export function AppTopbar() {
  const currentUserQuery = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation();

  return (
    <header className="z-20 shrink-0 border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl xl:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button className="lg:hidden" size="icon" variant="outline">
            <Menu className="size-5" />
          </Button>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Workspace
            </p>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Compliance Command
            </h1>
          </div>
        </div>

        <div className="hidden max-w-sm flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 transition-colors focus-within:border-cyan-300 focus-within:bg-white md:flex">
          <Search className="mr-2 size-4" />
          <span>Search controls, evidence, tasks...</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {currentUserQuery.data?.fullName ?? "Loading..."}
            </p>
            <p className="text-xs text-slate-500">
              {currentUserQuery.data?.email}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="text-slate-500 hover:text-slate-700"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
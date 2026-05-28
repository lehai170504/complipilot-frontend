"use client";

import { Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogoutMutation, useCurrentUserQuery } from "@/features/auth/hooks/auth-hooks";

export function AppTopbar() {
  const currentUserQuery = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation();

  return (
    <header className="z-20 shrink-0 border-b bg-background/90 px-4 py-3 backdrop-blur xl:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button className="lg:hidden" size="icon" variant="outline">
            <Menu className="size-5" />
          </Button>

          <div>
            <p className="text-sm text-muted-foreground">Workspace</p>
            <h1 className="text-xl font-semibold tracking-tight">
              Compliance Command Center
            </h1>
          </div>
        </div>

        <div className="hidden max-w-sm flex-1 items-center rounded-2xl border bg-white px-3 py-2 text-sm text-slate-500 md:flex">
          <Search className="mr-2 size-4" />
          Search controls, evidence, tasks...
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">
              {currentUserQuery.data?.fullName ?? "Loading..."}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentUserQuery.data?.email}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}
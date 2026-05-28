"use client";

import { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="h-screen overflow-hidden bg-slate-50">
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <AppTopbar />

            <main className="flex-1 overflow-y-auto px-4 py-6 xl:px-8">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
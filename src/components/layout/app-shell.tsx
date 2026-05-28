"use client";

import { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen">
          <AppSidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <AppTopbar />
            <main className="flex-1 px-4 py-6 xl:px-8">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
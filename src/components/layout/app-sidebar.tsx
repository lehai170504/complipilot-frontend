"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { appNavigationItems } from "@/components/layout/app-navigation";
import { WorkspaceSelector } from "@/components/layout/workspace-selector";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 shrink-0 overflow-hidden border-r border-white/6 bg-slate-950 text-white lg:flex lg:flex-col">
      <div className="relative p-5">
        <div className="absolute -right-16 -top-16 size-32 rounded-full bg-cyan-400/10 blur-3xl" />
        <Link className="relative flex items-center gap-3" href="/dashboard">
          <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400/20 to-cyan-600/20 text-cyan-300 ring-1 ring-cyan-300/20">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight">CompliPilot</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Compliance OS
            </p>
          </div>
        </Link>
      </div>

      <div className="px-5">
        <WorkspaceSelector />
      </div>

      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {appNavigationItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white",
                isActive &&
                  "bg-linear-to-r from-cyan-400/10 to-cyan-600/5 text-cyan-100 ring-1 ring-cyan-300/10"
              )}
              href={item.href}
              key={item.href}
            >
              <item.icon
                className={cn(
                  "size-4",
                  isActive ? "text-cyan-300" : "text-slate-500"
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 p-5">
        <div className="rounded-2xl border border-cyan-300/10 bg-linear-to-br from-cyan-400/5 to-cyan-600/5 p-4">
          <p className="text-sm font-semibold text-cyan-200">
            Audit-ready MVP
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Controls, evidence, tasks, and audit history are wired to the backend.
          </p>
        </div>
      </div>
    </aside>
  );
}
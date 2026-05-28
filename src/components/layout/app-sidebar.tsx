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
    <aside className="hidden h-screen w-72 shrink-0 overflow-hidden border-r border-white/10 bg-slate-950 text-white lg:flex lg:flex-col">
      <div className="p-5">
        <Link className="flex items-center gap-3" href="/dashboard">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <p className="font-bold tracking-tight">CompliPilot</p>
            <p className="text-xs text-slate-400">AI Compliance OS</p>
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
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/[0.06] hover:text-white",
                isActive && "bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-300/10"
              )}
              href={item.href}
              key={item.href}
            >
              <item.icon className="size-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 p-5">
        <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/10 p-4">
          <p className="text-sm font-semibold text-cyan-100">Audit-ready MVP</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">
            Controls, evidence, tasks, and audit history are wired to the backend contract.
          </p>
        </div>
      </div>
    </aside>
  );
}
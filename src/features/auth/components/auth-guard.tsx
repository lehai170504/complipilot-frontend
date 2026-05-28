"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { hasAuthCookies } from "@/lib/auth/token-cookies";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth-hooks";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const currentUserQuery = useCurrentUserQuery();

  useEffect(() => {
    if (!hasAuthCookies()) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (currentUserQuery.isError) {
      router.replace("/login");
    }
  }, [currentUserQuery.isError, router]);

  if (!hasAuthCookies()) {
    return null;
  }

  if (currentUserQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Loading workspace...</p>
          <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-500" />
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
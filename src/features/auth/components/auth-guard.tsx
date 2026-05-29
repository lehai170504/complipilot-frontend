"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { useCurrentUserQuery } from "@/features/auth/hooks/auth-hooks";
import { hasAuthCookies } from "@/lib/auth/token-cookies";

function AuthGuardLoading() {
  return (
    <main className="flex h-screen items-center justify-center bg-slate-50">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Loading workspace...
        </p>
        <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-500" />
        </div>
      </div>
    </main>
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [hasSession] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return hasAuthCookies();
  });

  const currentUserQuery = useCurrentUserQuery({
    enabled: hasSession,
  });

  useEffect(() => {
    if (!hasSession) {
      router.replace("/login");
    }
  }, [hasSession, router]);

  useEffect(() => {
    if (currentUserQuery.isError) {
      router.replace("/login");
    }
  }, [currentUserQuery.isError, router]);

  if (!hasSession) {
    return <AuthGuardLoading />;
  }

  if (currentUserQuery.isLoading) {
    return <AuthGuardLoading />;
  }

  return <>{children}</>;
}
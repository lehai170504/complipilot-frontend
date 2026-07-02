"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useCurrentUserQuery } from "@/features/auth/hooks/auth-hooks";
import { hasAuthCookies } from "@/lib/auth/token-cookies";

function AuthGuardLoading() {
  const t = useTranslations("authGuard");

  return (
    <main className="flex h-screen items-center justify-center bg-muted/30">
      <div className="rounded-3xl border bg-background p-8 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          {t("loadingWorkspace")}
        </p>
        <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-muted">
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

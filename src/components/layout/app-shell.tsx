"use client";

import { ReactNode, useEffect, useState } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import { OnboardingModal } from "@/features/onboarding/components/onboarding-modal";
import {
  dismissOnboarding,
  hasDismissedOnboarding,
} from "@/features/onboarding/onboarding-storage";

function AppShellContent({ children }: { children: ReactNode }) {
  const { activeOrganization } = useActiveOrganization();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const organizationId = activeOrganization?.organizationId;

  useEffect(() => {
    if (!hasDismissedOnboarding()) {
      const timer = window.setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 500);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  function handleDismissPermanently() {
    dismissOnboarding();
    setIsOnboardingOpen(false);
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AppTopbar organizationId={organizationId} />

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 xl:px-8">
            {children}
          </main>
        </div>
      </div>

      <OnboardingModal
        open={isOnboardingOpen}
        onOpenChange={setIsOnboardingOpen}
        organizationId={organizationId}
        onDismissPermanently={handleDismissPermanently}
      />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppShellContent>{children}</AppShellContent>
    </AuthGuard>
  );
}

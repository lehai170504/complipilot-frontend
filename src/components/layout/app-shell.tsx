"use client";

import { ReactNode, useEffect, useState } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { DisabledWorkspaceBanner } from "@/features/organizations/components/disabled-workspace-banner";
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
    <div className="flex h-screen w-full overflow-hidden bg-slate-100/50 dark:bg-slate-950">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300">
        <AppTopbar organizationId={organizationId} />

        <DisabledWorkspaceBanner organizationId={organizationId} />

        {/* Main Content Area with floating effect */}
        <div className="flex-1 overflow-hidden p-2 md:p-4">
          <main className="h-full overflow-y-auto rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900/50 dark:ring-white/10">
            <div className="mx-auto max-w-7xl px-4 py-6 xl:px-8 xl:py-8">
              {children}
            </div>
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

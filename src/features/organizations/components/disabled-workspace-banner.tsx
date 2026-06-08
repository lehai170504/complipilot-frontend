"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOrganizationSettingsQuery } from "@/features/organizations/hooks/organization-settings-hooks";

export function DisabledWorkspaceBanner({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const settingsQuery = useOrganizationSettingsQuery(organizationId);

  if (!organizationId || settingsQuery.data?.status !== "DISABLED") {
    return null;
  }

  return (
    <div className="border-b border-red-200 bg-red-50 px-4 py-3 xl:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 text-red-800">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />

          <div>
            <p className="text-sm font-semibold">This workspace is disabled</p>
            <p className="mt-1 text-xs leading-5">
              Most actions are locked. Existing compliance, evidence, tasks, and
              audit history remain available for review.
            </p>
          </div>
        </div>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="border-red-200 bg-white text-red-700 hover:bg-red-100 hover:text-red-800"
        >
          <Link href="/settings">
            View settings
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

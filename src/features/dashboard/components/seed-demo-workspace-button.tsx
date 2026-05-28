"use client";

import { DatabaseZap } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { useSeedDemoWorkspaceMutation } from "@/features/compliance/hooks/compliance-hooks";

export function SeedDemoWorkspaceButton({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const seedDemoWorkspaceMutation = useSeedDemoWorkspaceMutation();

  function handleSeedDemoWorkspace() {
    if (!organizationId) {
      return;
    }

    seedDemoWorkspaceMutation.mutate(organizationId);
  }

  return (
    <div className="space-y-3">
      <Button
        className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
        disabled={!organizationId || seedDemoWorkspaceMutation.isPending}
        onClick={handleSeedDemoWorkspace}
        type="button"
      >
        <DatabaseZap className="mr-2 size-4" />
        {seedDemoWorkspaceMutation.isPending
          ? "Preparing demo..."
          : "Seed demo workspace"}
      </Button>

      {seedDemoWorkspaceMutation.isSuccess ? (
        <p className="text-sm text-cyan-100">
          Demo framework applied. Created{" "}
          {seedDemoWorkspaceMutation.data.createdCount} controls, skipped{" "}
          {seedDemoWorkspaceMutation.data.skippedCount}.
        </p>
      ) : null}

      {seedDemoWorkspaceMutation.error ? (
        <ErrorAlert error={seedDemoWorkspaceMutation.error} />
      ) : null}
    </div>
  );
}
"use client";

import { DatabaseZap } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { useSeedDemoWorkspaceMutation } from "@/features/compliance/hooks/compliance-hooks";

export function SeedDemoWorkspaceButton({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const t = useTranslations("seedDemo");
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
        disabled={!organizationId || seedDemoWorkspaceMutation.isPending}
        onClick={handleSeedDemoWorkspace}
        type="button"
      >
        <DatabaseZap className="mr-2 size-4" />
        {seedDemoWorkspaceMutation.isPending ? t("preparing") : t("button")}
      </Button>

      {seedDemoWorkspaceMutation.isSuccess ? (
        <p className="text-sm text-primary/80">
          {t("success", {
            createdCount: seedDemoWorkspaceMutation.data.createdCount,
            skippedCount: seedDemoWorkspaceMutation.data.skippedCount,
          })}
        </p>
      ) : null}


    </div>
  );
}

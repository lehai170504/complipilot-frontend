"use client";

import { UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { useSeedDemoOrganizationUsersMutation } from "@/features/organizations/hooks/organization-members-hooks";

export function SeedDemoUsersButton({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const t = useTranslations("members");
  const seedMutation = useSeedDemoOrganizationUsersMutation(organizationId);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => seedMutation.mutate()}
        disabled={!organizationId || seedMutation.isPending}
      >
        <UsersRound className="mr-2 size-4" />
        {seedMutation.isPending ? t("seed.seeding") : t("seed.button")}
      </Button>

      {seedMutation.isSuccess ? (
        <p className="text-xs text-success">
          {t("seed.success", {
            createdUsers: seedMutation.data.createdUsers,
            createdMemberships: seedMutation.data.createdMemberships,
            updatedMemberships: seedMutation.data.updatedMemberships,
          })}
        </p>
      ) : null}

      {seedMutation.error ? <ErrorAlert error={seedMutation.error} /> : null}
    </div>
  );
}

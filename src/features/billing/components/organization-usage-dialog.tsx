"use client";

import { Crown } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { OrganizationUsageCard } from "@/features/billing/components/organization-usage-card";
import { useOrganizationUsageQuery } from "@/features/billing/hooks/billing-hooks";

export function OrganizationUsageDialog({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const { data: usage, isLoading } = useOrganizationUsageQuery(organizationId);

  if (!organizationId) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-primary hover:bg-primary/20 transition-colors">
          <Crown className="size-3.5" />
          {isLoading ? "..." : usage?.plan ?? "FREE"}
        </button>
      </DialogTrigger>

      {usage && (
        <DialogContent className="sm:max-w-4xl w-[95vw] p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Organization Usage Details</DialogTitle>
          <OrganizationUsageCard usage={usage} />
        </DialogContent>
      )}
    </Dialog>
  );
}

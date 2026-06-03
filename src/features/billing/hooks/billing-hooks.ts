import { useQuery } from "@tanstack/react-query";

import { getOrganizationUsage } from "@/lib/api/billing-api";

export function useOrganizationUsageQuery(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["organization-usage", organizationId],
    queryFn: () => getOrganizationUsage(organizationId!),
    enabled: Boolean(organizationId),
    staleTime: 30_000,
  });
}

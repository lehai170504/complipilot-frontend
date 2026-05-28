import { useQuery } from "@tanstack/react-query";

import {
  listAuditEvents,
  type ListAuditEventsParams,
} from "@/features/audit/api/audit-api";

export const auditQueryKeys = {
  list: (params: ListAuditEventsParams | undefined) =>
    ["audit-events", "list", params] as const,
};

export function useAuditEventsQuery(params: ListAuditEventsParams | undefined) {
  return useQuery({
    queryKey: auditQueryKeys.list(params),
    queryFn: () => listAuditEvents(params as ListAuditEventsParams),
    enabled: Boolean(params?.organizationId),
  });
}
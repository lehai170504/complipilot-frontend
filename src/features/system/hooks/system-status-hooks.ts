import { useQuery } from "@tanstack/react-query";

import { getSystemStatus } from "@/lib/api/system-status-api";

export function useSystemStatusQuery() {
  return useQuery({
    queryKey: ["system-status"],
    queryFn: getSystemStatus,
    refetchInterval: 60_000,
  });
}

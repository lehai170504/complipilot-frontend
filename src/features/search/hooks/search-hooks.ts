import { useQuery } from "@tanstack/react-query";

import { searchGlobal } from "@/features/search/api/search-api";

export const searchKeys = {
  all: ["search"] as const,
  global: (organizationId: string, query: string) =>
    [...searchKeys.all, organizationId, query] as const,
};

export function useGlobalSearchQuery(
  organizationId: string | undefined,
  query: string,
) {
  return useQuery({
    queryKey: searchKeys.global(organizationId!, query),
    queryFn: () => searchGlobal(organizationId!, query),
    enabled: !!organizationId && query.length >= 2,
    staleTime: 1000 * 60, // 1 minute
  });
}

import { apiClient } from "@/lib/api/api-client";
import type { GlobalSearchResultDto } from "@/lib/api/api-types";

export async function searchGlobal(
  organizationId: string,
  query: string,
): Promise<GlobalSearchResultDto> {
  return apiClient<GlobalSearchResultDto>(
    `/api/v1/search?organizationId=${organizationId}&query=${encodeURIComponent(query)}`
  );
}

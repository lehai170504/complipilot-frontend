import { apiClient } from "@/lib/api/api-client";
import type { SystemStatusResponse } from "@/lib/api/api-types";

export function getSystemStatus(): Promise<SystemStatusResponse> {
  return apiClient<SystemStatusResponse>("/api/v1/system/status");
}

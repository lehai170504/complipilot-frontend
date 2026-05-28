import { apiClient } from "@/lib/api/api-client";
import type {
  CompanyComplianceItem,
  ComplianceSummaryResponse,
} from "@/lib/api/api-types";

export async function getComplianceSummary(
  organizationId: string
): Promise<ComplianceSummaryResponse> {
  return apiClient<ComplianceSummaryResponse>(
    `/api/v1/organizations/${organizationId}/compliance-summary`
  );
}

export async function getDueSoonComplianceItems(
  organizationId: string
): Promise<CompanyComplianceItem[]> {
  return apiClient<CompanyComplianceItem[]>(
    `/api/v1/organizations/${organizationId}/compliance-items/due-soon`
  );
}

export async function getOverdueComplianceItems(
  organizationId: string
): Promise<CompanyComplianceItem[]> {
  return apiClient<CompanyComplianceItem[]>(
    `/api/v1/organizations/${organizationId}/compliance-items/overdue`
  );
}
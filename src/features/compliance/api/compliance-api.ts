import { apiClient } from "@/lib/api/api-client";
import type {
  ApplyFrameworkResponse,
  CompanyComplianceItem,
  ComplianceSummaryResponse,
  FrameworkResponse,
} from "@/lib/api/api-types";

export async function seedSecurityBaselineFramework(): Promise<FrameworkResponse> {
  return apiClient<FrameworkResponse>(
    "/api/v1/compliance/frameworks/seed/security-baseline",
    {
      method: "POST",
    }
  );
}

export async function applyFrameworkToOrganization(
  organizationId: string,
  frameworkId: string
): Promise<ApplyFrameworkResponse> {
  return apiClient<ApplyFrameworkResponse>(
    `/api/v1/organizations/${organizationId}/compliance-frameworks/${frameworkId}/apply`,
    {
      method: "POST",
    }
  );
}

export async function seedDemoWorkspace(
  organizationId: string
): Promise<ApplyFrameworkResponse> {
  const framework = await seedSecurityBaselineFramework();

  return applyFrameworkToOrganization(organizationId, framework.id);
}

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
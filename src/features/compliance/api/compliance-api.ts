import { apiClient } from "@/lib/api/api-client";
import type {
  ApplyFrameworkResponse,
  CompanyComplianceItem,
  ComplianceStatus,
  ComplianceSummaryResponse,
  FrameworkResponse,
  RequirementResponse,
} from "@/lib/api/api-types";

export type UpdateComplianceItemRequest = {
  status?: ComplianceStatus | null;
  ownerUserId?: string | null;
  dueDate?: string | null;
  notes?: string | null;
};

export type CreateFrameworkRequest = {
  code: string;
  name: string;
  description?: string | null;
};

export type CreateRequirementRequest = {
  code: string;
  title: string;
  description?: string | null;
  category?: string | null;
  sortOrder: number;
};

export type CreateComplianceItemRequest = {
  requirementId: string;
};

// ── Framework endpoints ──

export async function seedSecurityBaselineFramework(): Promise<FrameworkResponse> {
  return apiClient<FrameworkResponse>(
    "/api/v1/compliance/frameworks/seed/security-baseline",
    {
      method: "POST",
    }
  );
}

export async function listFrameworks(): Promise<FrameworkResponse[]> {
  return apiClient<FrameworkResponse[]>("/api/v1/compliance/frameworks");
}

export async function createFramework(
  request: CreateFrameworkRequest
): Promise<FrameworkResponse> {
  return apiClient<FrameworkResponse>("/api/v1/compliance/frameworks", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function listRequirements(
  frameworkId: string
): Promise<RequirementResponse[]> {
  return apiClient<RequirementResponse[]>(
    `/api/v1/compliance/frameworks/${frameworkId}/requirements`
  );
}

export async function createRequirement(
  frameworkId: string,
  request: CreateRequirementRequest
): Promise<RequirementResponse> {
  return apiClient<RequirementResponse>(
    `/api/v1/compliance/frameworks/${frameworkId}/requirements`,
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
}

// ── Organization compliance endpoints ──

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

export async function listComplianceItems(
  organizationId: string
): Promise<CompanyComplianceItem[]> {
  return apiClient<CompanyComplianceItem[]>(
    `/api/v1/organizations/${organizationId}/compliance-items`
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

export async function createComplianceItem(
  organizationId: string,
  request: CreateComplianceItemRequest
): Promise<CompanyComplianceItem> {
  return apiClient<CompanyComplianceItem>(
    `/api/v1/organizations/${organizationId}/compliance-items`,
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
}

export async function updateComplianceItem(
  organizationId: string,
  itemId: string,
  request: UpdateComplianceItemRequest
): Promise<CompanyComplianceItem> {
  return apiClient<CompanyComplianceItem>(
    `/api/v1/organizations/${organizationId}/compliance-items/${itemId}`,
    {
      method: "PATCH",
      body: JSON.stringify(request),
    }
  );
}
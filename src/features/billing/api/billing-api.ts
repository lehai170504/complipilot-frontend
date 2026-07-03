import { apiClient } from "@/lib/api/api-client";
import type {
  BillingPlanChangeRequestResponse,
  CheckoutSessionResponse,
  CustomerPortalResponse,
  CreateBillingPlanChangeRequest,
  CreateCheckoutSessionRequest,
  OrganizationUsageResponse,
  PageResponse,
} from "@/lib/api/api-types";

export function getOrganizationUsage(
  organizationId: string,
): Promise<OrganizationUsageResponse> {
  return apiClient<OrganizationUsageResponse>(
    `/api/v1/organizations/${organizationId}/billing/usage`,
  );
}

export function createBillingPlanChangeRequest(
  organizationId: string,
  request: CreateBillingPlanChangeRequest,
): Promise<BillingPlanChangeRequestResponse> {
  return apiClient<BillingPlanChangeRequestResponse>(
    `/api/v1/organizations/${organizationId}/billing/plan-change-requests`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );
}

export function getLatestBillingPlanChangeRequest(
  organizationId: string,
): Promise<BillingPlanChangeRequestResponse | null> {
  return apiClient<BillingPlanChangeRequestResponse | null>(
    `/api/v1/organizations/${organizationId}/billing/plan-change-requests/latest`,
  );
}

export function createCheckoutSession(
  organizationId: string,
  request: CreateCheckoutSessionRequest,
): Promise<CheckoutSessionResponse> {
  return apiClient<CheckoutSessionResponse>(
    `/api/v1/organizations/${organizationId}/billing/checkout-session`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );
}

export function createCustomerPortalSession(
  organizationId: string,
): Promise<CustomerPortalResponse> {
  return apiClient<CustomerPortalResponse>(
    `/api/v1/organizations/${organizationId}/billing/customer-portal`,
    {
      method: "POST",
    },
  );
}

export function listBillingPlanChangeRequests(
  organizationId: string,
  page = 0,
  size = 10,
): Promise<PageResponse<BillingPlanChangeRequestResponse>> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  return apiClient<PageResponse<BillingPlanChangeRequestResponse>>(
    `/api/v1/organizations/${organizationId}/billing/plan-change-requests?${searchParams.toString()}`,
  );
}

export function cancelBillingPlanChangeRequest(
  organizationId: string,
  requestId: string,
): Promise<BillingPlanChangeRequestResponse> {
  return apiClient<BillingPlanChangeRequestResponse>(
    `/api/v1/organizations/${organizationId}/billing/plan-change-requests/${requestId}/cancel`,
    {
      method: "PATCH",
    },
  );
}

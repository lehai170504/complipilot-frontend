import { apiClient } from "@/lib/api/api-client";
import type {
  CheckoutSessionResponse,
  CustomerPortalResponse,
  CreateCheckoutSessionRequest,
  OrganizationUsageResponse,
} from "@/lib/api/api-types";

export function getOrganizationUsage(
  organizationId: string,
): Promise<OrganizationUsageResponse> {
  return apiClient<OrganizationUsageResponse>(
    `/api/v1/organizations/${organizationId}/billing/usage`,
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


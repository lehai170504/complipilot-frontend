import type { OrganizationMembership } from "@/lib/api/api-types";

export type ActiveOrganization = Pick<
  OrganizationMembership,
  "organizationId" | "organizationName" | "organizationSlug" | "role" | "status"
>;
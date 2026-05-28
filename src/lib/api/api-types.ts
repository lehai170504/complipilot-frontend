export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type SortDirection = "ASC" | "DESC";

export type ApiErrorResponse = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  requestId: string | null;
  fieldViolations: {
    field: string;
    message: string;
  }[];
};

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
};

export type OrganizationMembership = {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: "OWNER" | "ADMIN" | "COMPLIANCE_MANAGER" | "MEMBER" | "AUDITOR";
  status: "ACTIVE" | "INVITED" | "DISABLED";
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresInSeconds: number;
  user: AuthUser;
};

export type RegisterResponse = {
  userId: string;
  organizationId: string;
  email: string;
  fullName: string;
  organizationName: string;
  role: "OWNER";
};
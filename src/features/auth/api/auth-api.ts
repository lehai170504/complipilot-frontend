import { apiClient } from "@/lib/api/api-client";
import type {
  AuthUser,
  LoginResponse,
  OrganizationMembership,
  RegisterResponse,
} from "@/lib/api/api-types";
import { clearAuthCookies, getRefreshToken, setAuthCookies } from "@/lib/auth/token-cookies";
import { appConfig } from "@/lib/config/app-config";
import type { LoginRequest, RegisterRequest } from "@/features/auth/types/auth-types";
import { clearActiveOrganization } from "@/features/organizations/api/organization-storage";

export async function registerUser(request: RegisterRequest): Promise<RegisterResponse> {
  return apiClient<RegisterResponse>(
    "/api/v1/auth/register",
    {
      method: "POST",
      body: JSON.stringify(request),
    },
    false
  );
}

export async function loginUser(request: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>(
    "/api/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify(request),
    },
    false
  );

  setAuthCookies(response.accessToken, response.refreshToken);

  return response;
}

export async function logoutUser(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    await fetch(`${appConfig.apiBaseUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }

  clearAuthCookies();
  clearActiveOrganization();
}

export async function getCurrentUser(): Promise<AuthUser> {
  return apiClient<AuthUser>("/api/v1/me");
}

export async function getMyOrganizations(): Promise<OrganizationMembership[]> {
  return apiClient<OrganizationMembership[]>("/api/v1/me/organizations");
}
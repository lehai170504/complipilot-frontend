import { apiFetch, API_BASE_URL } from "@/lib/api/client";
import { clearAuthTokens, getRefreshToken, setAuthTokens } from "@/lib/auth/token-storage";
import type { AuthUser, LoginResponse, OrganizationMembership, RegisterResponse } from "@/lib/api/types";

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
  organizationName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(request),
  }, false);
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(request),
  }, false);

  setAuthTokens(response.accessToken, response.refreshToken);

  return response;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }

  clearAuthTokens();
}

export async function getCurrentUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/v1/me");
}

export async function getMyOrganizations(): Promise<OrganizationMembership[]> {
  return apiFetch<OrganizationMembership[]>("/api/v1/me/organizations");
}
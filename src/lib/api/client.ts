import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from "@/lib/auth/token-storage";
import type { ApiErrorResponse, LoginResponse } from "@/lib/api/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";

function createRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

async function parseApiError(response: Response, path: string, fallbackRequestId: string): Promise<ApiErrorResponse> {
  const body = (await response.json().catch(() => null)) as ApiErrorResponse | null;

  return body ?? {
    timestamp: new Date().toISOString(),
    status: response.status,
    error: response.statusText,
    message: response.statusText,
    path,
    requestId: response.headers.get("X-Request-Id") ?? fallbackRequestId,
    fieldViolations: [],
  };
}

async function refreshAuthToken(): Promise<LoginResponse> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const requestId = createRequestId();

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAuthTokens();
    throw await parseApiError(response, "/api/v1/auth/refresh", requestId);
  }

  const data = (await response.json()) as LoginResponse;
  setAuthTokens(data.accessToken, data.refreshToken);

  return data;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retryOnUnauthorized = true
): Promise<T> {
  const token = getAccessToken();
  const requestId = createRequestId();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 401 && retryOnUnauthorized && getRefreshToken()) {
    await refreshAuthToken();
    return apiFetch<T>(path, options, false);
  }

  if (!response.ok) {
    throw await parseApiError(response, path, requestId);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export { API_BASE_URL };
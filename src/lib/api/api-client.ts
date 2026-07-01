import { appConfig } from "@/lib/config/app-config";
import { ApiClientError } from "@/lib/api/api-error";
import type { ApiErrorResponse, LoginResponse } from "@/lib/api/api-types";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/auth/token-cookies";
import { getClientLocale } from "@/i18n/locale-cookie";

type ApiClientOptions = RequestInit & {
  auth?: boolean;
};

function createRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

async function parseApiError(
  response: Response,
  path: string,
  fallbackRequestId: string,
): Promise<ApiClientError> {
  const body = (await response
    .json()
    .catch(() => null)) as ApiErrorResponse | null;

  return new ApiClientError(
    body ?? {
      timestamp: new Date().toISOString(),
      status: response.status,
      error: response.statusText,
      message: response.statusText || "Request failed",
      path,
      requestId: response.headers.get("X-Request-Id") ?? fallbackRequestId,
      fieldViolations: [],
    },
  );
}

async function refreshAuthToken(): Promise<LoginResponse> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthCookies();
    throw new Error("Missing refresh token");
  }

  const requestId = createRequestId();

  const locale = getClientLocale();

  const response = await fetch(`${appConfig.apiBaseUrl}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
      "Accept-Language": locale,
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAuthCookies();
    throw await parseApiError(response, "/api/v1/auth/refresh", requestId);
  }

  const data = (await response.json()) as LoginResponse;
  setAuthCookies(data.accessToken, data.refreshToken);

  return data;
}

export async function apiClient<TResponse>(
  path: string,
  options: ApiClientOptions = {},
  retryOnUnauthorized = true,
): Promise<TResponse> {
  const requestId = createRequestId();
  const shouldAttachAuth = options.auth ?? true;
  const accessToken = shouldAttachAuth ? getAccessToken() : undefined;

  const headers = options.headers;

  const fetchOptions: RequestInit = {
    ...options,
  };

  delete (fetchOptions as ApiClientOptions).auth;
  delete fetchOptions.headers;

  const locale = getClientLocale();

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
      "Accept-Language": locale,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(headers ?? {}),
    },
  });

  if (
    response.status === 401 &&
    retryOnUnauthorized &&
    shouldAttachAuth &&
    getRefreshToken()
  ) {
    await refreshAuthToken();
    return apiClient<TResponse>(path, options, false);
  }

  if (!response.ok) {
    throw await parseApiError(response, path, requestId);
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  const text = await response.text();
  if (!text || text.trim() === "") {
    return null as TResponse;
  }

  return JSON.parse(text) as TResponse;
}

import { appConfig } from "@/lib/config/app-config";
import { ApiClientError } from "@/lib/api/api-error";
import type { ApiErrorResponse } from "@/lib/api/api-types";
import { getAccessToken } from "@/lib/auth/token-cookies";
import { getClientLocale } from "@/i18n/locale-cookie";

function createRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

async function parseExportError(
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
      message: response.statusText || "Export failed",
      path,
      requestId: response.headers.get("X-Request-Id") ?? fallbackRequestId,
      fieldViolations: [],
    },
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadCsvExport(
  path: string,
  filename: string,
): Promise<void> {
  const accessToken = getAccessToken();
  const requestId = createRequestId();
  const locale = getClientLocale();

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: "GET",
    headers: {
      "X-Request-Id": requestId,
      "Accept-Language": locale,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (!response.ok) {
    throw await parseExportError(response, path, requestId);
  }

  const blob = await response.blob();
  downloadBlob(blob, filename);
}

export function downloadComplianceItemsCsv(
  organizationId: string,
): Promise<void> {
  return downloadCsvExport(
    `/api/v1/organizations/${organizationId}/exports/compliance-items.csv`,
    `compliance-items-${new Date().toISOString().slice(0, 10)}.csv`,
  );
}

export function downloadEvidenceCsv(organizationId: string): Promise<void> {
  return downloadCsvExport(
    `/api/v1/organizations/${organizationId}/exports/evidence.csv`,
    `evidence-${new Date().toISOString().slice(0, 10)}.csv`,
  );
}

export function downloadAuditEventsCsv(organizationId: string): Promise<void> {
  return downloadCsvExport(
    `/api/v1/organizations/${organizationId}/exports/audit-events.csv`,
    `audit-events-${new Date().toISOString().slice(0, 10)}.csv`,
  );
}

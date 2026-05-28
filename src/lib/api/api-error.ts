import type { ApiErrorResponse } from "@/lib/api/api-types";

export class ApiClientError extends Error {
  readonly status: number;
  readonly error: string;
  readonly path: string;
  readonly requestId: string | null;
  readonly fieldViolations: ApiErrorResponse["fieldViolations"];

  constructor(response: ApiErrorResponse) {
    super(response.message);

    this.name = "ApiClientError";
    this.status = response.status;
    this.error = response.error;
    this.path = response.path;
    this.requestId = response.requestId;
    this.fieldViolations = response.fieldViolations;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export function getErrorRequestId(error: unknown): string | null {
  if (error instanceof ApiClientError) {
    return error.requestId;
  }

  return null;
}
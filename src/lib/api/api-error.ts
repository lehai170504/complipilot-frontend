export type ApiErrorPayload = {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  requestId?: string;
  fieldViolations?: Array<{
    field: string;
    message: string;
  }>;
};

export type FriendlyApiError = {
  title: string;
  description: string;
  requestId?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

export function parseApiErrorPayload(error: unknown): ApiErrorPayload | null {
  if (!isRecord(error)) {
    return null;
  }

  const response = error.response;

  if (isRecord(response) && isRecord(response.data)) {
    return response.data as ApiErrorPayload;
  }

  if (isRecord(error.data)) {
    return error.data as ApiErrorPayload;
  }

  return null;
}

export function getFriendlyApiError(error: unknown): FriendlyApiError {
  const payload = parseApiErrorPayload(error);

  const status = payload?.status;
  const path = payload?.path ?? "";
  const message = payload?.message;
  const requestId = payload?.requestId;

  if (status === 400) {
    return {
      title: "Request could not be processed",
      description: message ?? "Please check the form data and try again.",
      requestId,
    };
  }

  if (status === 401) {
    return {
      title: "Session expired",
      description: "Please sign in again to continue.",
      requestId,
    };
  }

  if (status === 403) {
    return {
      title: "Access denied",
      description: "You do not have permission to perform this action.",
      requestId,
    };
  }

  if (status === 404) {
    if (path.includes("/download-url")) {
      return {
        title: "File not found in storage",
        description:
          "This evidence record exists, but the uploaded file is missing. Please archive it and upload the file again.",
        requestId,
      };
    }

    return {
      title: "Resource not found",
      description: message ?? "The requested resource could not be found.",
      requestId,
    };
  }

  if (status === 409) {
    return {
      title: "Action cannot be completed",
      description: message ?? "This action conflicts with the current state.",
      requestId,
    };
  }

  if (status === 429) {
    return {
      title: "Too many requests",
      description: "Please wait a moment and try again.",
      requestId,
    };
  }

  if (path.includes("/evidence/upload-url")) {
    return {
      title: "Upload could not start",
      description:
        "We could not prepare a secure upload link. Please try again.",
      requestId,
    };
  }

  if (path.includes("/download-url")) {
    return {
      title: "Download failed",
      description:
        "We could not create a secure download link. Please re-upload this evidence if the file is missing.",
      requestId,
    };
  }

  if (path.includes("/ai/analyze")) {
    return {
      title: "AI analysis unavailable",
      description:
        "The AI service is temporarily unavailable. Please try again later.",
      requestId,
    };
  }

  const fallbackMessage = isRecord(error) ? getString(error.message) : undefined;

  if (fallbackMessage === "Failed to fetch") {
    return {
      title: "Network request failed",
      description:
        "The request could not reach the server. Please check the deployment URL or try again.",
      requestId,
    };
  }

  if (fallbackMessage?.toLowerCase().includes("storage upload failed")) {
    return {
      title: "File upload failed",
      description:
        "The file could not be uploaded to storage. Please try uploading it again.",
      requestId,
    };
  }

  return {
    title: "Something went wrong",
    description: message ?? fallbackMessage ?? "Unexpected server error.",
    requestId,
  };
}
"use client";

import { useEffect, useRef } from "react";

import { getFriendlyApiError } from "@/lib/api/api-error";
import { toast } from "@/lib/toast";

const shownErrors = new WeakSet<object>();

export function ErrorAlert({
  error,
  className,
}: {
  error: unknown;
  className?: string;
}) {
  const lastError = useRef<unknown>(undefined);

  void className;

  useEffect(() => {
    if (!error || Object.is(lastError.current, error)) {
      return;
    }

    lastError.current = error;
    if (typeof error === "object" && shownErrors.has(error)) {
      return;
    }

    if (typeof error === "object") {
      shownErrors.add(error);
    }

    const friendlyError = getFriendlyApiError(error);
    toast.error(friendlyError.title, {
      description: friendlyError.requestId
        ? `${friendlyError.description} Request ID: ${friendlyError.requestId}`
        : friendlyError.description,
    });
  }, [error]);

  return null;
}
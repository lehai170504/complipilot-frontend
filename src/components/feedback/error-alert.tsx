import { AlertTriangle } from "lucide-react";

import { getFriendlyApiError } from "@/lib/api/api-error";
import { cn } from "@/lib/utils";

export function ErrorAlert({
  error,
  className,
}: {
  error: unknown;
  className?: string;
}) {
  const friendlyError = getFriendlyApiError(error);

  return (
    <div
      className={cn(
        "rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-500" />
        <div>
          <p className="font-semibold">{friendlyError.title}</p>
          <p className="mt-1 leading-6">{friendlyError.description}</p>

          {friendlyError.requestId ? (
            <p className="mt-3 text-xs text-red-500">
              Request ID: {friendlyError.requestId}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
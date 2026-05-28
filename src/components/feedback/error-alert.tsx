import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getErrorMessage, getErrorRequestId } from "@/lib/api/api-error";

export function ErrorAlert({ error }: { error: unknown }) {
  const requestId = getErrorRequestId(error);

  return (
    <Alert variant="destructive">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        <p>{getErrorMessage(error)}</p>
        {requestId ? (
          <p className="mt-2 text-xs opacity-80">Request ID: {requestId}</p>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
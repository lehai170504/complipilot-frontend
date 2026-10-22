import type { FieldErrors, FieldValues } from "react-hook-form";

import { toast } from "@/lib/toast";

export function toastFirstValidationError<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
) {
  const firstError = Object.values(errors).find(
    (error) =>
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.trim().length > 0,
  );

  if (
    firstError &&
    "message" in firstError &&
    typeof firstError.message === "string"
  ) {
    toast.error(firstError.message);
  }
}

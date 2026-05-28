import type { ComplianceStatus } from "@/lib/api/api-types";

export const complianceStatusOptions: ComplianceStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "READY_FOR_REVIEW",
  "COMPLIANT",
  "NON_COMPLIANT",
  "WAIVED",
];

export const complianceStatusLabels: Record<ComplianceStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  READY_FOR_REVIEW: "Ready for review",
  COMPLIANT: "Compliant",
  NON_COMPLIANT: "Non-compliant",
  WAIVED: "Waived",
};
import type { EvidenceSourceType, EvidenceType } from "@/lib/api/api-types";

export const evidenceTypeOptions: EvidenceType[] = [
  "POLICY",
  "PROCEDURE",
  "SCREENSHOT",
  "REPORT",
  "CONTRACT",
  "CERTIFICATE",
  "AUDIT_NOTE",
  "OTHER",
];

export const evidenceTypeLabels: Record<EvidenceType, string> = {
  POLICY: "Policy",
  PROCEDURE: "Procedure",
  SCREENSHOT: "Screenshot",
  REPORT: "Report",
  CONTRACT: "Contract",
  CERTIFICATE: "Certificate",
  AUDIT_NOTE: "Audit note",
  OTHER: "Other",
};

export const evidenceSourceTypeOptions: EvidenceSourceType[] = [
  "FILE",
  "URL",
  "TEXT_NOTE",
];

export const evidenceSourceTypeLabels: Record<EvidenceSourceType, string> = {
  FILE: "File",
  URL: "URL",
  TEXT_NOTE: "Text note",
};

export const evidenceSortOptions = [
  {
    value: "createdAt",
    label: "Created date",
  },
  {
    value: "updatedAt",
    label: "Updated date",
  },
  {
    value: "title",
    label: "Title",
  },
  {
    value: "evidenceType",
    label: "Evidence type",
  },
  {
    value: "sourceType",
    label: "Source type",
  },
] as const;
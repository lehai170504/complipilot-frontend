export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type SortDirection = "ASC" | "DESC";

export type ApiErrorResponse = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  requestId: string | null;
  fieldViolations: {
    field: string;
    message: string;
  }[];
};

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
};

export type OrganizationMembership = {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: "OWNER" | "ADMIN" | "COMPLIANCE_MANAGER" | "MEMBER" | "AUDITOR";
  status: "ACTIVE" | "INVITED" | "DISABLED";
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresInSeconds: number;
  user: AuthUser;
};

export type RegisterResponse = {
  userId: string;
  organizationId: string;
  email: string;
  fullName: string;
  organizationName: string;
  role: "OWNER";
};

export type ComplianceStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "READY_FOR_REVIEW"
  | "COMPLIANT"
  | "NON_COMPLIANT"
  | "WAIVED";

export type CompanyComplianceItem = {
  id: string;
  organizationId: string;
  requirementId: string;
  requirementCode: string;
  requirementTitle: string;
  status: ComplianceStatus;
  ownerUserId: string | null;
  dueDate: string | null;
  notes: string | null;
};

export type ComplianceSummaryResponse = {
  organizationId: string;
  totalItems: number;
  open: number;
  inProgress: number;
  readyForReview: number;
  compliant: number;
  nonCompliant: number;
  waived: number;
};

export type ComplianceTaskStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELLED";

export type ComplianceTaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type ComplianceTask = {
  id: string;
  organizationId: string;
  complianceItemId: string | null;
  title: string;
  description: string | null;
  assigneeUserId: string | null;
  assigneeEmail: string | null;
  createdByUserId: string;
  createdByEmail: string;
  status: ComplianceTaskStatus;
  priority: ComplianceTaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ComplianceTaskSummaryResponse = {
  organizationId: string;
  total: number;
  open: number;
  inProgress: number;
  done: number;
  cancelled: number;
  overdue: number;
};

export type AuditAction =
  | "COMPLIANCE_FRAMEWORK_APPLIED"
  | "COMPLIANCE_ITEM_CREATED"
  | "COMPLIANCE_ITEM_UPDATED"
  | "EVIDENCE_DOCUMENT_CREATED"
  | "EVIDENCE_DOCUMENT_UPDATED"
  | "EVIDENCE_DOCUMENT_ARCHIVED"
  | "EVIDENCE_LINK_CREATED"
  | "EVIDENCE_LINK_DELETED"
  | "COMPLIANCE_TASK_CREATED"
  | "COMPLIANCE_TASK_UPDATED"
  | "COMPLIANCE_TASK_DELETED";

export type AuditResourceType =
  | "COMPLIANCE_FRAMEWORK"
  | "COMPLIANCE_ITEM"
  | "EVIDENCE_DOCUMENT"
  | "EVIDENCE_LINK"
  | "COMPLIANCE_TASK";

export type AuditEvent = {
  id: string;
  organizationId: string;
  actorUserId: string | null;
  actorEmail: string | null;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: string | null;
  summary: string;
  metadataJson: string | null;
  createdAt: string;
};

export type FrameworkResponse = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  systemTemplate: boolean;
};

export type ApplyFrameworkResponse = {
  organizationId: string;
  frameworkId: string;
  createdCount: number;
  skippedCount: number;
  createdItems: CompanyComplianceItem[];
};

export type EvidenceType =
  | "POLICY"
  | "PROCEDURE"
  | "SCREENSHOT"
  | "REPORT"
  | "CONTRACT"
  | "CERTIFICATE"
  | "AUDIT_NOTE"
  | "OTHER";

export type EvidenceSourceType = "FILE" | "URL" | "TEXT_NOTE";

export type EvidenceStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type EvidenceDocument = {
  id: string;
  organizationId: string;
  title: string;
  description: string | null;
  evidenceType: EvidenceType;
  sourceType: EvidenceSourceType;
  fileObjectKey: string | null;
  externalUrl: string | null;
  contentType: string | null;
  fileSizeBytes: number | null;
  uploadedByUserId: string;
  status: EvidenceStatus;
  createdAt: string;
  updatedAt: string;
};

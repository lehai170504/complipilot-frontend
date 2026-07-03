import { OrganizationMemberRole } from "@/features/organizations/api/organization-members-api";

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

export type ComplianceTaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

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
  | "COMPLIANCE_TASK_DELETED"
  | "ORGANIZATION_DISABLED"
  | "BILLING_PLAN_CHANGE_REQUESTED"
  | "BILLING_PLAN_CHANGE_APPROVED"
  | "BILLING_PLAN_CHANGE_REJECTED"
  | "BILLING_PLAN_CHANGE_CANCELLED";

export type AuditResourceType =
  | "COMPLIANCE_FRAMEWORK"
  | "COMPLIANCE_ITEM"
  | "EVIDENCE_DOCUMENT"
  | "EVIDENCE_LINK"
  | "COMPLIANCE_TASK"
  | "ORGANIZATION"
  | "BILLING_PLAN_CHANGE_REQUEST"
  | "BILLING_PLAN_CHANGE_CANCELLED";

export type AuditEventResponse = {
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

export type RequirementResponse = {
  id: string;
  frameworkId: string;
  code: string;
  title: string;
  description: string | null;
  category: string | null;
  sortOrder: number;
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

export type CreateEvidenceUploadUrlResponse = {
  objectKey: string;
  uploadUrl: string;
  method: "PUT";
  expiresInMinutes: number;
  uploadToken?: string | null;
};

export type EvidenceDownloadUrlResponse = {
  downloadUrl: string;
  method: "GET";
  expiresInMinutes: number;
};

export type ComplianceItemEvidenceLink = {
  linkId: string;
  complianceItemId: string;
  evidence: EvidenceDocument;
  linkedByUserId: string;
  linkedAt: string;
};

export type UpdateEvidenceDocumentRequest = {
  title: string;
  description?: string | null;
  evidenceType: EvidenceType;
  externalUrl?: string | null;
};

export type CreateComplianceTaskRequest = {
  complianceItemId?: string | null;
  title: string;
  description?: string | null;
  assigneeUserId?: string | null;
  priority?: ComplianceTaskPriority | null;
  dueDate?: string | null;
};

export type EvidenceAiAnalysisResponse = {
  id: string;
  evidenceId: string;
  summary: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  findings: string[];
  missingInformation: string[];
  suggestedActions: string[];
  analyzedByEmail: string;
  analyzedAt: string;
};

export type ComplianceEvidenceSuggestionResponse = {
  summary: string;
  coverageLevel: "NONE" | "WEAK" | "PARTIAL" | "STRONG";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  existingEvidenceAssessment: string[];
  missingEvidence: string[];
  suggestedActions: string[];
  reviewerNote: string;
};

export type SubscriptionPlan = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";

export type SubscriptionStatus =
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "TRIALING";

export type OrganizationUsageResponse = {
  organizationId: string;
  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  memberCount: number;
  memberLimit: number;
  evidenceDocumentCount: number;
  evidenceDocumentLimit: number;
  storageUsedBytes: number;
  storageLimitBytes: number;
  aiAnalysisCountThisMonth: number;
  aiAnalysisLimitPerMonth: number;
};

export type OrganizationInvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "EXPIRED"
  | "REVOKED";

export type CreateOrganizationInvitationRequest = {
  email: string;
  role: OrganizationMemberRole;
};

export type AcceptOrganizationInvitationRequest = {
  email: string;
  fullName: string;
  password: string;
};

export type OrganizationInvitationResponse = {
  id: string;
  organizationId: string;
  organizationName: string;
  email: string;
  role: OrganizationMemberRole;
  status: OrganizationInvitationStatus;
  invitedByUserId: string;
  invitedByEmail: string;
  acceptedByUserId: string | null;
  acceptedByEmail: string | null;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  invitationToken: string | null;
  acceptUrl: string | null;
};

export type NotificationType =
  | "INVITATION_CREATED"
  | "INVITATION_ACCEPTED"
  | "EVIDENCE_CREATED"
  | "EVIDENCE_ARCHIVED"
  | "AI_ANALYSIS_COMPLETED"
  | "TASK_CREATED"
  | "TASK_ASSIGNED"
  | "COMPLIANCE_ITEM_UPDATED"
  | "BILLING_PLAN_CHANGE_REQUESTED"
  | "BILLING_PLAN_CHANGE_APPROVED"
  | "BILLING_PLAN_CHANGE_REJECTED"
  | "BILLING_PLAN_CHANGE_CANCELLED";

export type NotificationResponse = {
  id: string;
  organizationId: string;
  recipientUserId: string;
  type: NotificationType;
  title: string;
  message: string;
  resourceType: string | null;
  resourceId: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
};

export type UnreadNotificationCountResponse = {
  unreadCount: number;
};

export type OrganizationStatus = "ACTIVE" | "DISABLED";

export type UserStatus = "ACTIVE" | "DISABLED";

export type UserProfileResponse = {
  id: string;
  email: string;
  fullName: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserProfileRequest = {
  fullName: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type PlatformOrganizationResponse = {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  plan: SubscriptionPlan | null;
  subscriptionStatus: SubscriptionStatus | null;
  activeMemberCount: number;
  evidenceDocumentCount: number;
  storageBytes: number;
  aiAnalysisCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PlatformUserResponse = {
  id: string;
  email: string;
  fullName: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationSettingsResponse = {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
};

export type UpdateOrganizationSettingsRequest = {
  name: string;
};

export type DisableOrganizationRequest = {
  confirmation: string;
};

export type SystemComponentStatus = "UP" | "WARN" | "DOWN";

export type SystemStatusComponentResponse = {
  key: string;
  label: string;
  status: SystemComponentStatus;
  message: string;
  details: Record<string, unknown>;
};

export type SystemStatusResponse = {
  status: SystemComponentStatus;
  service: string;
  version: string;
  timestamp: string;
  components: SystemStatusComponentResponse[];
};

export type BillingPlanChangeRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type BillingPlanChangeRequestResponse = {
  id: string;
  organizationId: string;
  organizationName: string;
  requestedByUserId: string;
  requestedByEmail: string;
  currentPlan: SubscriptionPlan;
  requestedPlan: SubscriptionPlan;
  requestNote: string | null;
  status: BillingPlanChangeRequestStatus;
  reviewedByUserId: string | null;
  reviewedByEmail: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBillingPlanChangeRequest = {
  requestedPlan: SubscriptionPlan;
  requestNote?: string | null;
};

export type BillingCheckoutProvider = "MANUAL" | "STRIPE";

export type CreateCheckoutSessionRequest = {
  plan: SubscriptionPlan;
};

export type CheckoutSessionResponse = {
  provider: BillingCheckoutProvider;
  plan: SubscriptionPlan;
  checkoutUrl: string | null;
  message: string;
};

export type CustomerPortalResponse = {
  url: string;
};

export type SearchResultItemDto = {
  id: string;
  title: string;
  description: string | null;
  url: string;
};

export type GlobalSearchResultDto = {
  complianceItems: SearchResultItemDto[];
  evidence: SearchResultItemDto[];
  tasks: SearchResultItemDto[];
  auditEvents: SearchResultItemDto[];
};

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Link2,
  Link2Off,
  Save,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ComplianceStatusBadge } from "@/features/compliance/components/compliance-status-badge";
import {
  allowedComplianceTransitions,
  complianceStatusLabels,
  complianceStatusOptions,
} from "@/features/compliance/constants";
import {
  useComplianceItemsQuery,
  useUpdateComplianceItemMutation,
} from "@/features/compliance/hooks/compliance-hooks";
import {
  EvidenceSourceBadge,
  EvidenceTypeBadge,
} from "@/features/evidence/components/evidence-badges";
import { EvidenceSelector } from "@/features/evidence/components/evidence-selector";
import {
  useEvidenceLinksQuery,
  useLinkEvidenceMutation,
  useUnlinkEvidenceMutation,
} from "@/features/evidence/hooks/evidence-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import type { ComplianceStatus } from "@/lib/api/api-types";

function formatDate(date: string | null) {
  if (!date) return "No due date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatFileSize(size: number | null) {
  if (!size) return "Unknown size";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default function ComplianceItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ itemId: string }>();
  const itemId = params.itemId;

  const { activeOrganization, canManageCompliance } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const complianceItemsQuery = useComplianceItemsQuery(organizationId);
  const updateMutation = useUpdateComplianceItemMutation(organizationId);
  const evidenceLinksQuery = useEvidenceLinksQuery(organizationId, itemId);
  const linkMutation = useLinkEvidenceMutation(organizationId, itemId);
  const unlinkMutation = useUnlinkEvidenceMutation(organizationId, itemId);

  const [showEvidenceSelector, setShowEvidenceSelector] = useState(false);

  const item = complianceItemsQuery.data?.find((i) => i.id === itemId);

  const [status, setStatus] = useState<ComplianceStatus | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const effectiveStatus = status ?? item?.status ?? "OPEN";
  const effectiveNotes = notes || (item?.notes ?? "");
  const hasChanges =
    item != null &&
    ((status !== undefined && status !== item.status) ||
      (notes !== "" && notes !== (item.notes ?? "")));

  const allowedNextStatuses = item
    ? allowedComplianceTransitions[item.status] ?? []
    : [];

  function handleSave() {
    if (!item || !organizationId) return;
    updateMutation.mutate(
      {
        itemId: item.id,
        request: {
          status: status ?? item.status,
          notes: notes.trim() || item.notes || null,
        },
      },
      { onSuccess: () => setStatus(undefined) }
    );
  }

  function handleLink(evidenceDocumentId: string) {
    linkMutation.mutate(evidenceDocumentId, {
      onSuccess: () => setShowEvidenceSelector(false),
    });
  }

  function handleUnlink(evidenceDocumentId: string) {
    unlinkMutation.mutate(evidenceDocumentId);
  }

  if (complianceItemsQuery.isLoading) {
    return (
      <div className="rounded-3xl border bg-white p-8 text-muted-foreground shadow-sm">
        Loading control details...
      </div>
    );
  }

  if (!item) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <h3 className="text-xl font-semibold">Control not found</h3>
          <p className="mt-2 text-muted-foreground">
            This compliance item does not exist or you do not have access.
          </p>
          <Button className="mt-5" onClick={() => router.push("/compliance")}>
            <ArrowLeft className="mr-2 size-4" />
            Back to compliance
          </Button>
        </CardContent>
      </Card>
    );
  }

  const linkedEvidence = evidenceLinksQuery.data ?? [];
  const linkedEvidenceIds = new Set(
    linkedEvidence.map((link) => link.evidence.id)
  );

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/compliance")}
        className="text-muted-foreground"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to compliance
      </Button>

      <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-semibold text-cyan-200">
              {item.requirementCode}
            </span>
            <ComplianceStatusBadge status={item.status} />
          </div>
          <h2 className="mt-4 max-w-3xl truncate text-3xl font-bold tracking-tight md:text-4xl">
            {item.requirementTitle}
          </h2>
          <div className="mt-3 flex items-center gap-2 text-slate-300">
            <CalendarDays className="size-4" />
            Due {formatDate(item.dueDate)}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Notes &amp; status</h3>

              {canManageCompliance ? (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={effectiveStatus}
                      onValueChange={(v) =>
                        setStatus(v as ComplianceStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {complianceStatusOptions
                          .filter(
                            (o) =>
                              o === item.status ||
                              allowedNextStatuses.includes(o)
                          )
                          .map((o) => (
                            <SelectItem key={o} value={o}>
                              {complianceStatusLabels[o]}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={effectiveNotes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add compliance notes, evidence context..."
                      rows={4}
                    />
                  </div>

                  {updateMutation.error ? (
                    <ErrorAlert error={updateMutation.error} />
                  ) : null}

                  <div className="flex justify-end">
                    <Button
                      disabled={!hasChanges || updateMutation.isPending}
                      onClick={handleSave}
                    >
                      <Save className="mr-2 size-4" />
                      {updateMutation.isPending ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    {item.notes ?? "No notes recorded for this control."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Linked evidence ({linkedEvidence.length})
                </h3>

                {canManageCompliance ? (
                  <Button
                    onClick={() => setShowEvidenceSelector(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Link2 className="mr-2 size-4" />
                    Link evidence
                  </Button>
                ) : null}
              </div>

              {evidenceLinksQuery.isLoading ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Loading linked evidence...
                </p>
              ) : linkedEvidence.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  No evidence linked to this control yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {linkedEvidence.map((link) => (
                    <div
                      key={link.linkId}
                      className="rounded-2xl border bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <EvidenceTypeBadge
                              type={link.evidence.evidenceType}
                            />
                            <EvidenceSourceBadge
                              sourceType={link.evidence.sourceType}
                            />
                          </div>
                          <h4 className="mt-2 font-semibold">
                            {link.evidence.title}
                          </h4>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {link.evidence.description ??
                              "No description"}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {link.evidence.sourceType === "FILE" ? (
                              <span>
                                {link.evidence.contentType ?? "Unknown"} ·{" "}
                                {formatFileSize(link.evidence.fileSizeBytes)}
                              </span>
                            ) : null}
                            {link.evidence.externalUrl ? (
                              <a
                                className="inline-flex items-center text-cyan-700 hover:text-cyan-800"
                                href={link.evidence.externalUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open URL
                                <ExternalLink className="ml-1 size-3" />
                              </a>
                            ) : null}
                            <span>
                              Linked {formatDateTime(link.linkedAt)}
                            </span>
                          </div>
                        </div>

                        {canManageCompliance ? (
                          <Button
                            onClick={() => handleUnlink(link.evidence.id)}
                            disabled={unlinkMutation.isPending}
                            size="sm"
                            variant="ghost"
                          >
                            <Link2Off className="size-4" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {unlinkMutation.error ? (
                <div className="mt-3">
                  <ErrorAlert error={unlinkMutation.error} />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {showEvidenceSelector ? (
          <EvidenceSelector
            organizationId={organizationId}
            linkedEvidenceIds={linkedEvidenceIds}
            onLink={handleLink}
            onClose={() => setShowEvidenceSelector(false)}
            isLinking={linkMutation.isPending}
          />
        ) : null}

        {linkMutation.error ? (
          <div className="xl:col-span-2">
            <ErrorAlert error={linkMutation.error} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

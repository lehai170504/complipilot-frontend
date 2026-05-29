"use client";

import { Archive, Download, ExternalLink, FileCheck2 } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EvidenceSourceBadge,
  EvidenceTypeBadge,
} from "@/features/evidence/components/evidence-badges";
import {
  useArchiveEvidenceMutation,
  useCreateEvidenceDownloadUrlMutation,
} from "@/features/evidence/hooks/evidence-hooks";
import type { EvidenceDocument } from "@/lib/api/api-types";

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatFileSize(size: number | null) {
  if (!size) {
    return "Unknown size";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function EvidenceCard({
  evidence,
  organizationId,
  canManageCompliance,
}: {
  evidence: EvidenceDocument;
  organizationId: string | undefined;
  canManageCompliance: boolean;
}) {
  const archiveMutation = useArchiveEvidenceMutation(organizationId);
  const downloadUrlMutation =
    useCreateEvidenceDownloadUrlMutation(organizationId);

  function handleArchive() {
    const confirmed = window.confirm(
      `Archive evidence "${evidence.title}"? This will remove it from the active evidence list.`
    );

    if (!confirmed) {
      return;
    }

    archiveMutation.mutate(evidence.id);
  }

  async function handleDownload() {
    const response = await downloadUrlMutation.mutateAsync(evidence.id);

    window.open(response.downloadUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                <FileCheck2 className="size-5" />
              </div>
              <EvidenceTypeBadge type={evidence.evidenceType} />
              <EvidenceSourceBadge sourceType={evidence.sourceType} />
            </div>

            <h3 className="mt-4 text-lg font-semibold tracking-tight">
              {evidence.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {evidence.description ?? "No description provided."}
            </p>

            {evidence.sourceType === "FILE" ? (
              <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm">
                <p className="font-medium text-slate-700">
                  Stored file evidence
                </p>
                <p className="mt-1 text-muted-foreground">
                  {evidence.contentType ?? "Unknown content type"} ·{" "}
                  {formatFileSize(evidence.fileSizeBytes)}
                </p>
                <p className="mt-1 break-all text-xs text-muted-foreground">
                  Object key: {evidence.fileObjectKey}
                </p>
              </div>
            ) : null}

            {evidence.externalUrl ? (
              <a
                className="mt-4 inline-flex items-center text-sm font-medium text-cyan-700 hover:text-cyan-800"
                href={evidence.externalUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open external evidence
                <ExternalLink className="ml-2 size-4" />
              </a>
            ) : null}

            <p className="mt-4 text-xs text-muted-foreground">
              Created {formatDateTime(evidence.createdAt)}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            {evidence.sourceType === "FILE" ? (
              <Button
                disabled={downloadUrlMutation.isPending}
                onClick={handleDownload}
                size="sm"
                type="button"
                variant="outline"
              >
                <Download className="mr-2 size-4" />
                {downloadUrlMutation.isPending ? "Preparing..." : "Download"}
              </Button>
            ) : null}

            {canManageCompliance ? (
              <Button
                disabled={archiveMutation.isPending}
                onClick={handleArchive}
                size="sm"
                type="button"
                variant="outline"
              >
                <Archive className="mr-2 size-4" />
                {archiveMutation.isPending ? "Archiving..." : "Archive"}
              </Button>
            ) : null}
          </div>
        </div>

        {downloadUrlMutation.error ? (
          <div className="border-t bg-red-50 p-5">
            <ErrorAlert error={downloadUrlMutation.error} />
          </div>
        ) : null}

        {archiveMutation.error ? (
          <div className="border-t bg-red-50 p-5">
            <ErrorAlert error={archiveMutation.error} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
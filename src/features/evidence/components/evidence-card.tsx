"use client";

import { useState } from "react";
import {
  Archive,
  Download,
  ExternalLink,
  FileCheck2,
  History,
  MoreHorizontal,
  Pencil,
  Sparkles,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EvidenceSourceBadge,
  EvidenceTypeBadge,
} from "@/features/evidence/components/evidence-badges";
import { EvidenceAiAnalysisPanel } from "@/features/evidence/components/evidence-ai-analysis-panel";
import { EvidenceAiHistoryDialog } from "@/features/evidence/components/evidence-ai-history-dialog";
import {
  useAnalyzeEvidenceWithAiMutation,
  useArchiveEvidenceMutation,
  useCreateEvidenceDownloadUrlMutation,
  useLatestEvidenceAiAnalysisQuery,
} from "@/features/evidence/hooks/evidence-hooks";
import type { EvidenceDocument } from "@/lib/api/api-types";

function formatDateTime(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatFileSize(size: number | null, unknownSize: string) {
  if (!size) {
    return unknownSize;
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
  onEdit,
}: {
  evidence: EvidenceDocument;
  organizationId: string | undefined;
  canManageCompliance: boolean;
  onEdit?: () => void;
}) {
  const locale = useLocale();

  const t = useTranslations("evidenceCard");
  const tAiActions = useTranslations("ai.actions");
  const tEvidenceAi = useTranslations("ai.evidenceAnalysis");

  const [isAnalysisVisible, setIsAnalysisVisible] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const archiveMutation = useArchiveEvidenceMutation(organizationId);
  const downloadUrlMutation =
    useCreateEvidenceDownloadUrlMutation(organizationId);
  const analyzeMutation = useAnalyzeEvidenceWithAiMutation(organizationId);

  const latestAnalysisQuery = useLatestEvidenceAiAnalysisQuery(
    organizationId,
    evidence.id,
  );

  const analysis = analyzeMutation.data ?? latestAnalysisQuery.data;

  function handleArchive() {
    const confirmed = window.confirm(
      t("archiveConfirm", {
        title: evidence.title,
      }),
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

  function handleAnalyze() {
    setIsAnalysisVisible(true);
    analyzeMutation.mutate(evidence.id);
  }

  return (
    <>
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

              <h3 className="mt-4 truncate text-lg font-semibold tracking-tight">
                {evidence.title}
              </h3>

              <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-muted-foreground">
                {evidence.description ?? t("noDescription")}
              </p>

              {evidence.sourceType === "FILE" ? (
                <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm">
                  <p className="font-medium text-slate-700">
                    {t("storedFile")}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {evidence.contentType ?? t("unknownContentType")} ·{" "}
                    {formatFileSize(evidence.fileSizeBytes, t("unknownSize"))}
                  </p>
                  <p className="mt-1 max-w-full truncate text-xs text-muted-foreground">
                    {t("objectKey", {
                      objectKey: evidence.fileObjectKey ?? "—",
                    })}
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
                  {t("openExternal")}
                  <ExternalLink className="ml-2 size-4" />
                </a>
              ) : null}

              <p className="mt-4 text-xs text-muted-foreground">
                {t("created", {
                  date: formatDateTime(evidence.createdAt, locale),
                })}
              </p>
            </div>

            {/* Khung chứa các nút hành động (Đã được cấu trúc lại) */}
            <div className="flex shrink-0 items-start gap-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                {evidence.sourceType === "FILE" ? (
                  <Button
                    disabled={downloadUrlMutation.isPending}
                    onClick={handleDownload}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Download className="mr-2 size-4" />
                    {downloadUrlMutation.isPending
                      ? t("preparing")
                      : t("download")}
                  </Button>
                ) : null}

                <Button
                  disabled={analyzeMutation.isPending}
                  onClick={handleAnalyze}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Sparkles className="mr-2 size-4" />
                  {analyzeMutation.isPending
                    ? tAiActions("analyzing")
                    : analysis
                      ? tAiActions("reanalyze")
                      : tAiActions("analyze")}
                </Button>

                {analysis && !isAnalysisVisible ? (
                  <Button
                    onClick={() => setIsAnalysisVisible(true)}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    {tAiActions("viewLatest")}
                  </Button>
                ) : null}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canManageCompliance ? (
                    <DropdownMenuItem onClick={onEdit}>
                      <Pencil className="mr-2 size-4" />
                      {t("edit")}
                    </DropdownMenuItem>
                  ) : null}

                  <DropdownMenuItem onClick={() => setIsHistoryOpen(true)}>
                    <History className="mr-2 size-4" />
                    {tAiActions("history")}
                  </DropdownMenuItem>

                  {canManageCompliance ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:bg-red-50 focus:text-red-600"
                        onClick={handleArchive}
                        disabled={archiveMutation.isPending}
                      >
                        <Archive className="mr-2 size-4" />
                        {archiveMutation.isPending
                          ? t("archiving")
                          : t("archive")}
                      </DropdownMenuItem>
                    </>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
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

          {analysis && isAnalysisVisible ? (
            <div className="border-t bg-white p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Sparkles className="size-4 text-cyan-700" />
                  {tEvidenceAi("resultTitle")}
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAnalysisVisible(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="mr-2 size-4" />
                  {tAiActions("close")}
                </Button>
              </div>

              <EvidenceAiAnalysisPanel analysis={analysis} />
            </div>
          ) : null}

          {analyzeMutation.error && isAnalysisVisible ? (
            <div className="border-t bg-red-50 p-5">
              <div className="mb-3 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAnalysisVisible(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="mr-2 size-4" />
                  {tAiActions("close")}
                </Button>
              </div>

              <ErrorAlert error={analyzeMutation.error} />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <EvidenceAiHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        organizationId={organizationId}
        evidenceId={evidence.id}
      />
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { FileCheck2, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateFileEvidenceDialog } from "@/features/evidence/components/create-file-evidence-dialog";
import { CreateUrlEvidenceDialog } from "@/features/evidence/components/create-url-evidence-dialog";
import { EditEvidenceDialog } from "@/features/evidence/components/edit-evidence-dialog";
import { EvidenceCard } from "@/features/evidence/components/evidence-card";
import {
  EvidenceToolbar,
  type EvidenceToolbarState,
} from "@/features/evidence/components/evidence-toolbar";
import { useEvidenceQuery } from "@/features/evidence/hooks/evidence-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import { useExportEvidenceCsvMutation } from "@/features/exports/hooks/export-hooks";
import type { EvidenceDocument } from "@/lib/api/api-types";

export default function EvidencePage() {
  const t = useTranslations("evidencePage");
  const tPagination = useTranslations("pagination");
  const tCommon = useTranslations("common");

  const { activeOrganization, canManageCompliance } = useActiveOrganization();
  const exportEvidenceCsvMutation = useExportEvidenceCsvMutation();

  const [page, setPage] = useState(0);
  const [isCreateUrlDialogOpen, setIsCreateUrlDialogOpen] = useState(false);
  const [isCreateFileDialogOpen, setIsCreateFileDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] =
    useState<EvidenceDocument | null>(null);
  const [toolbarState, setToolbarState] = useState<EvidenceToolbarState>({
    q: "",
    evidenceType: undefined,
    sourceType: undefined,
    sortBy: "createdAt",
    sortDirection: "DESC",
  });

  const [parent] = useAutoAnimate();

  const organizationId = activeOrganization?.organizationId;

  const evidenceQueryParams = useMemo(
    () =>
      organizationId
        ? {
          organizationId,
          page,
          size: 10,
          q: toolbarState.q.trim() || undefined,
          evidenceType: toolbarState.evidenceType,
          sourceType: toolbarState.sourceType,
          sortBy: toolbarState.sortBy,
          sortDirection: toolbarState.sortDirection,
        }
        : undefined,
    [organizationId, page, toolbarState],
  );

  const evidenceQuery = useEvidenceQuery(evidenceQueryParams);

  function handleToolbarChange(nextState: EvidenceToolbarState) {
    setToolbarState(nextState);
    setPage(0);
  }

  const evidenceItems = evidenceQuery.data?.items ?? [];
  const totalPages = evidenceQuery.data?.totalPages ?? 0;
  const totalItems = evidenceQuery.data?.totalItems ?? 0;

  return (
    <div className="space-y-6">
      <section className="compliance-hero">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              {t("heroEyebrow")}
            </p>
            <h2 className="mt-4 max-w-3xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
              {t("heroTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              {t("heroDescription")}
            </p>
          </div>

          <div className="rounded-3xl border border-border/50 bg-muted/30 p-5 backdrop-blur-md">
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{t("activeEvidence")}</p>
            <p className="mt-1 text-3xl font-extrabold text-foreground">{totalItems}</p>
            <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {activeOrganization?.organizationName ?? t("loadingWorkspace")}
            </div>
          </div>
        </div>
      </section>

      <EvidenceToolbar
        value={toolbarState}
        onChange={handleToolbarChange}
        onCreateUrlClick={() => setIsCreateUrlDialogOpen(true)}
        onCreateFileClick={() => setIsCreateFileDialogOpen(true)}
        onExportClick={() => {
          if (organizationId) {
            exportEvidenceCsvMutation.mutate(organizationId);
          }
        }}
        isExporting={exportEvidenceCsvMutation.isPending}
        canManageCompliance={canManageCompliance}
      />

      {evidenceQuery.error ? <ErrorAlert error={evidenceQuery.error} /> : null}

      {evidenceQuery.isLoading ? (
        <Card className="compliance-surface">
          <CardContent className="p-8 text-muted-foreground">
            {t("loading")}
          </CardContent>
        </Card>
      ) : evidenceItems.length === 0 ? (
        <Card className="compliance-surface">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="rounded-3xl bg-primary/10 p-4 text-primary">
              <FileCheck2 className="size-8" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">{t("emptyTitle")}</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              {t("emptyDescription")}
            </p>

            {canManageCompliance ? (
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button onClick={() => setIsCreateFileDialogOpen(true)}>
                  {t("uploadFile")}
                </Button>
                <Button
                  onClick={() => setIsCreateUrlDialogOpen(true)}
                  variant="outline"
                >
                  {t("addUrl")}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <section ref={parent} className="grid gap-4">
          {evidenceItems.map((evidence) => (
            <EvidenceCard
              key={evidence.id}
              evidence={evidence}
              organizationId={organizationId}
              canManageCompliance={canManageCompliance}
              onEdit={() => {
                setEditingEvidence(evidence);
                setIsEditDialogOpen(true);
              }}
            />
          ))}
        </section>
      )}

      <div className="flex items-center justify-between rounded-3xl border border-border/50 bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          {tPagination("summary", {
            page: page + 1,
            totalPages: Math.max(totalPages, 1),
            totalItems,
          })}
        </p>

        <div className="flex gap-2">
          <Button
            disabled={page <= 0 || evidenceQuery.isFetching}
            onClick={() =>
              setPage((currentPage) => Math.max(currentPage - 1, 0))
            }
            variant="outline"
          >
            {tCommon("previous")}
          </Button>
          <Button
            disabled={page + 1 >= totalPages || evidenceQuery.isFetching}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            variant="outline"
          >
            {tCommon("next")}
          </Button>
        </div>
      </div>

      <CreateUrlEvidenceDialog
        open={isCreateUrlDialogOpen}
        onOpenChange={setIsCreateUrlDialogOpen}
        organizationId={organizationId}
      />

      <CreateFileEvidenceDialog
        open={isCreateFileDialogOpen}
        onOpenChange={setIsCreateFileDialogOpen}
        organizationId={organizationId}
      />

      <EditEvidenceDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        organizationId={organizationId}
        evidence={editingEvidence}
      />
    </div>
  );
}

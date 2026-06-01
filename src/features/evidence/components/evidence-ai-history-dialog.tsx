"use client";

import { Clock, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEvidenceAiAnalysesQuery } from "@/features/evidence/hooks/evidence-hooks";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function EvidenceAiHistoryDialog({
  open,
  onOpenChange,
  organizationId,
  evidenceId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
  evidenceId: string;
}) {
  const tAi = useTranslations("ai.evidenceAnalysis");

  const historyQuery = useEvidenceAiAnalysesQuery(
    organizationId,
    evidenceId,
    open,
  );

  const analyses = historyQuery.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-cyan-700" />
            AI analysis history
          </DialogTitle>
          <DialogDescription>
            Latest saved AI analysis records for this evidence.
          </DialogDescription>
        </DialogHeader>

        {historyQuery.isLoading ? (
          <div className="rounded-2xl border bg-slate-50 p-5 text-sm text-muted-foreground">
            Loading AI history...
          </div>
        ) : null}

        {historyQuery.error ? <ErrorAlert error={historyQuery.error} /> : null}

        {!historyQuery.isLoading && analyses.length === 0 ? (
          <div className="rounded-2xl border bg-slate-50 p-5 text-sm text-muted-foreground">
            No AI analysis history yet.
          </div>
        ) : null}

        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="rounded-2xl border bg-white p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{analysis.riskLevel} risk</Badge>
                    <Badge variant="secondary">
                      {Math.round(analysis.confidence * 100)}% confidence
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {analysis.summary}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {formatDateTime(analysis.analyzedAt)}
                    {analysis.analyzedByEmail
                      ? ` by ${analysis.analyzedByEmail}`
                      : ""}
                  </div>
                </div>
              </div>

              {analysis.missingInformation.length > 0 ? (
                <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                  <p className="font-medium">{tAi("missingInformation")}</p>
                  <ul className="mt-1 space-y-1">
                    {analysis.missingInformation.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

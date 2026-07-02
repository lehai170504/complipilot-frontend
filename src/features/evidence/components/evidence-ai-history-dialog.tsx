"use client";

import { Clock, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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

function formatDateTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
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
  const locale = useLocale();

  const tHistory = useTranslations("ai.evidenceHistory");
  const tEvidenceAi = useTranslations("ai.evidenceAnalysis");
  const tRiskLevels = useTranslations("ai.riskLevels");

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
            <Sparkles className="size-5 text-primary" />
            {tHistory("title")}
          </DialogTitle>
          <DialogDescription>{tHistory("description")}</DialogDescription>
        </DialogHeader>

        {historyQuery.isLoading ? (
          <div className="rounded-2xl border bg-muted/30 p-5 text-sm text-muted-foreground">
            {tHistory("loading")}
          </div>
        ) : null}

        {historyQuery.error ? <ErrorAlert error={historyQuery.error} /> : null}

        {!historyQuery.isLoading && analyses.length === 0 ? (
          <div className="rounded-2xl border bg-muted/30 p-5 text-sm text-muted-foreground">
            {tHistory("empty")}
          </div>
        ) : null}

        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="rounded-2xl border bg-background p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {tEvidenceAi("risk", {
                        risk: tRiskLevels(analysis.riskLevel),
                      })}
                    </Badge>
                    <Badge variant="secondary">
                      {tEvidenceAi("confidence", {
                        confidence: Math.round(analysis.confidence * 100),
                      })}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {analysis.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>
                      {tEvidenceAi("analyzedAt", {
                        date: formatDateTime(analysis.analyzedAt, locale),
                      })}
                    </span>
                    {analysis.analyzedByEmail ? (
                      <span>
                        {tEvidenceAi("analyzedBy", {
                          email: analysis.analyzedByEmail,
                        })}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {analysis.missingInformation.length > 0 ? (
                <div className="mt-3 rounded-xl bg-warning/10 p-3 text-sm text-warning">
                  <p className="font-medium">
                    {tEvidenceAi("missingInformation")}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {analysis.missingInformation.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {analysis.suggestedActions.length > 0 ? (
                <div className="mt-3 rounded-xl bg-primary/5 p-3 text-sm text-cyan-900">
                  <p className="font-medium">
                    {tEvidenceAi("suggestedActions")}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {analysis.suggestedActions.map((item) => (
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

import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ComplianceEvidenceSuggestionResponse } from "@/lib/api/api-types";
import { useTranslations } from "next-intl";

const riskClassNameMap: Record<
  ComplianceEvidenceSuggestionResponse["riskLevel"],
  string
> = {
  LOW: "bg-success/10 text-success hover:bg-emerald-50",
  MEDIUM: "bg-warning/10 text-warning hover:bg-amber-50",
  HIGH: "bg-destructive/10 text-red-700 hover:bg-red-50",
  CRITICAL: "bg-red-100 text-red-800 hover:bg-red-100",
};

const coverageClassNameMap: Record<
  ComplianceEvidenceSuggestionResponse["coverageLevel"],
  string
> = {
  NONE: "bg-destructive/10 text-red-700 hover:bg-red-50",
  WEAK: "bg-warning/10 text-warning hover:bg-amber-50",
  PARTIAL: "bg-blue-50 text-blue-700 hover:bg-blue-50",
  STRONG: "bg-success/10 text-success hover:bg-emerald-50",
};

export function ComplianceAiSuggestionPanel({
  suggestion,
}: {
  suggestion: ComplianceEvidenceSuggestionResponse;
}) {
  const t = useTranslations("ai.complianceSuggestion");
  const tRiskLevels = useTranslations("ai.riskLevels");
  const tCoverageLevels = useTranslations("ai.coverageLevels");
  return (
    <Card className="compliance-surface border-primary/30 bg-cyan-50/60">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-background text-primary">
              <Sparkles className="size-5" />
            </div>

            <div>
              <p className="font-semibold text-foreground">{t("panelTitle")}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                {suggestion.summary}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Badge
              className={coverageClassNameMap[suggestion.coverageLevel]}
              variant="secondary"
            >
              {t("coverage", {
                coverage: tCoverageLevels(suggestion.coverageLevel),
              })}
            </Badge>

            <Badge
              className={riskClassNameMap[suggestion.riskLevel]}
              variant="secondary"
            >
              {t("risk", {
                risk: tRiskLevels(suggestion.riskLevel),
              })}
            </Badge>

            <Badge variant="secondary">
              {t("confidence", {
                confidence: Math.round(suggestion.confidence * 100),
              })}
            </Badge>
          </div>
        </div>

        {suggestion.existingEvidenceAssessment.length > 0 ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle2 className="size-4 text-success" />
              {t("existingEvidenceAssessment")}
            </div>
            <ul className="space-y-1 text-sm leading-6 text-slate-700">
              {suggestion.existingEvidenceAssessment.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {suggestion.missingEvidence.length > 0 ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle className="size-4 text-amber-600" />
              {t("missingEvidence")}
            </div>
            <ul className="space-y-1 text-sm leading-6 text-slate-700">
              {suggestion.missingEvidence.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {suggestion.suggestedActions.length > 0 ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Lightbulb className="size-4 text-primary" />
              {t("suggestedActions")}
            </div>
            <ul className="space-y-1 text-sm leading-6 text-slate-700">
              {suggestion.suggestedActions.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-2xl border border-primary/30 bg-background p-3 text-sm leading-6 text-muted-foreground">
          {suggestion.reviewerNote}
        </div>
      </CardContent>
    </Card>
  );
}

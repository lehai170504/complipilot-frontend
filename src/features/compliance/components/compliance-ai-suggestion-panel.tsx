import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ComplianceEvidenceSuggestionResponse } from "@/lib/api/api-types";
import { useTranslations } from "next-intl";

const riskClassNameMap: Record<
  ComplianceEvidenceSuggestionResponse["riskLevel"],
  string
> = {
  LOW: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  MEDIUM: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  HIGH: "bg-red-50 text-red-700 hover:bg-red-50",
  CRITICAL: "bg-red-100 text-red-800 hover:bg-red-100",
};

const coverageClassNameMap: Record<
  ComplianceEvidenceSuggestionResponse["coverageLevel"],
  string
> = {
  NONE: "bg-red-50 text-red-700 hover:bg-red-50",
  WEAK: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  PARTIAL: "bg-blue-50 text-blue-700 hover:bg-blue-50",
  STRONG: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
};

export function ComplianceAiSuggestionPanel({
  suggestion,
}: {
  suggestion: ComplianceEvidenceSuggestionResponse;
}) {
  const t = useTranslations("ai.complianceSuggestion");
  return (
    <Card className="border-cyan-200 bg-cyan-50/60">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
              <Sparkles className="size-5" />
            </div>

            <div>
              <p className="font-semibold text-slate-950">{t("panelTitle")}</p>
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
              {t("coverage", { coverage: suggestion.coverageLevel })}
            </Badge>

            <Badge
              className={riskClassNameMap[suggestion.riskLevel]}
              variant="secondary"
            >
              {t("risk", { risk: suggestion.riskLevel })}
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
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="size-4 text-emerald-600" />
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
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
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
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Lightbulb className="size-4 text-cyan-700" />
              {t("suggestedActions")}
            </div>
            <ul className="space-y-1 text-sm leading-6 text-slate-700">
              {suggestion.suggestedActions.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-2xl border border-cyan-200 bg-white p-3 text-sm leading-6 text-slate-600">
          {suggestion.reviewerNote}
        </div>
      </CardContent>
    </Card>
  );
}

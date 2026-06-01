import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";

import type { EvidenceAiAnalysisResponse } from "@/lib/api/api-types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";

const riskClassNameMap: Record<
  EvidenceAiAnalysisResponse["riskLevel"],
  string
> = {
  LOW: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  MEDIUM: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  HIGH: "bg-red-50 text-red-700 hover:bg-red-50",
  CRITICAL: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function EvidenceAiAnalysisPanel({
  analysis,
}: {
  analysis: EvidenceAiAnalysisResponse;
}) {
  const t = useTranslations("ai.evidenceAnalysis");
  const locale = useLocale();
  const tRiskLevels = useTranslations("ai.riskLevels");

  return (
    <Card className="border-cyan-200 bg-cyan-50/60">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-950">{t("title")}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                {analysis.summary}
              </p>
              {analysis.analyzedAt ? (
                <p className="mt-2 text-xs text-slate-500">
                  {t("analyzedAt", {
                    date: new Intl.DateTimeFormat(locale, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(analysis.analyzedAt)),
                  })}
                  {analysis.analyzedByEmail
                    ? ` ${t("analyzedBy", { email: analysis.analyzedByEmail })}`
                    : ""}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Badge
              className={riskClassNameMap[analysis.riskLevel]}
              variant="secondary"
            >
              {t("risk", { risk: tRiskLevels(analysis.riskLevel) })}
            </Badge>
            <Badge variant="secondary">
              {t("confidence", {
                confidence: Math.round(analysis.confidence * 100),
              })}
            </Badge>
          </div>
        </div>

        {analysis.findings.length > 0 ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="size-4 text-emerald-600" />
              {t("findings")}
            </div>
            <ul className="space-y-1 text-sm leading-6 text-slate-700">
              {analysis.findings.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {analysis.missingInformation.length > 0 ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <AlertTriangle className="size-4 text-amber-600" />
              {t("missingInformation")}
            </div>
            <ul className="space-y-1 text-sm leading-6 text-slate-700">
              {analysis.missingInformation.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {analysis.suggestedActions.length > 0 ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Lightbulb className="size-4 text-cyan-700" />
              {t("suggestedActions")}
            </div>
            <ul className="space-y-1 text-sm leading-6 text-slate-700">
              {analysis.suggestedActions.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

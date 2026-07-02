import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { EvidenceAiAnalysisResponse } from "@/lib/api/api-types";

const riskClassNameMap: Record<
  EvidenceAiAnalysisResponse["riskLevel"],
  string
> = {
  LOW: "bg-success/10 text-success hover:bg-emerald-50",
  MEDIUM: "bg-warning/10 text-warning hover:bg-amber-50",
  HIGH: "bg-destructive/10 text-red-700 hover:bg-red-50",
  CRITICAL: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function EvidenceAiAnalysisPanel({
  analysis,
  onClose,
}: {
  analysis: EvidenceAiAnalysisResponse;
  onClose?: () => void;
}) {
  const t = useTranslations("ai.evidenceAnalysis");
  const locale = useLocale();
  const tRiskLevels = useTranslations("ai.riskLevels");

  const findings = analysis.findings ?? [];
  const missingInformation = analysis.missingInformation ?? [];
  const suggestedActions = analysis.suggestedActions ?? [];

  const confidence = Number.isFinite(analysis.confidence)
    ? Math.round(analysis.confidence * 100)
    : 0;

  return (
    <Card className="compliance-surface border-primary/30 bg-cyan-50/60">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-background text-primary">
              <Sparkles className="size-5" />
            </div>

            <div>
              <p className="font-semibold text-foreground">{t("title")}</p>

              <p className="mt-1 text-sm leading-6 text-slate-700">
                {analysis.summary}
              </p>

              {analysis.analyzedAt ? (
                <p className="mt-2 text-xs text-muted-foreground">
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
                    ? ` ${t("analyzedBy", {
                        email: analysis.analyzedByEmail,
                      })}`
                    : ""}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Badge
              className={riskClassNameMap[analysis.riskLevel]}
              variant="secondary"
            >
              {t("risk", { risk: tRiskLevels(analysis.riskLevel) })}
            </Badge>

            <Badge variant="secondary">
              {t("confidence", {
                confidence,
              })}
            </Badge>

            {onClose ? (
              <Button
                aria-label="Close AI analysis"
                className="size-8 rounded-full"
                onClick={onClose}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>

        {findings.length > 0 ? (
          <AnalysisList
            icon={<CheckCircle2 className="size-4 text-success" />}
            items={findings}
            title={t("findings")}
          />
        ) : null}

        {missingInformation.length > 0 ? (
          <AnalysisList
            icon={<AlertTriangle className="size-4 text-amber-600" />}
            items={missingInformation}
            title={t("missingInformation")}
          />
        ) : null}

        {suggestedActions.length > 0 ? (
          <AnalysisList
            icon={<Lightbulb className="size-4 text-primary" />}
            items={suggestedActions}
            title={t("suggestedActions")}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

function AnalysisList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </div>

      <ul className="space-y-1 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

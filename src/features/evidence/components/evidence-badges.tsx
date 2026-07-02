import { useTranslations } from "next-intl";

import type { EvidenceSourceType, EvidenceType } from "@/lib/api/api-types";
import { Badge } from "@/components/ui/badge";

export function EvidenceTypeBadge({ type }: { type: EvidenceType }) {
  const t = useTranslations("evidenceLabels.types");

  return (
    <Badge
      className="bg-primary/5 text-primary hover:bg-cyan-50"
      variant="secondary"
    >
      {t(type)}
    </Badge>
  );
}

export function EvidenceSourceBadge({
  sourceType,
}: {
  sourceType: EvidenceSourceType;
}) {
  const t = useTranslations("evidenceLabels.sources");

  const className =
    sourceType === "URL"
      ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
      : sourceType === "FILE"
        ? "bg-success/10 text-success hover:bg-emerald-50"
        : "bg-purple-50 text-purple-700 hover:bg-purple-50";

  return (
    <Badge className={className} variant="secondary">
      {t(sourceType)}
    </Badge>
  );
}
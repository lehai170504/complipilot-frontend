import type { EvidenceSourceType, EvidenceType } from "@/lib/api/api-types";
import { Badge } from "@/components/ui/badge";
import {
  evidenceSourceTypeLabels,
  evidenceTypeLabels,
} from "@/features/evidence/constants";

export function EvidenceTypeBadge({ type }: { type: EvidenceType }) {
  return (
    <Badge className="bg-cyan-50 text-cyan-700 hover:bg-cyan-50" variant="secondary">
      {evidenceTypeLabels[type]}
    </Badge>
  );
}

export function EvidenceSourceBadge({ sourceType }: { sourceType: EvidenceSourceType }) {
  const className =
    sourceType === "URL"
      ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
      : sourceType === "FILE"
        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
        : "bg-purple-50 text-purple-700 hover:bg-purple-50";

  return (
    <Badge className={className} variant="secondary">
      {evidenceSourceTypeLabels[sourceType]}
    </Badge>
  );
}
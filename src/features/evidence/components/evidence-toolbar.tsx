"use client";

import { Link2, UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";

import type {
  EvidenceSourceType,
  EvidenceType,
  SortDirection,
} from "@/lib/api/api-types";
import { FilterBar } from "@/components/layout/filter-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  evidenceSourceTypeOptions,
  evidenceTypeOptions,
} from "@/features/evidence/constants";

const ALL = "ALL";

export type EvidenceToolbarState = {
  q: string;
  evidenceType: EvidenceType | undefined;
  sourceType: EvidenceSourceType | undefined;
  sortBy: "createdAt" | "updatedAt" | "title" | "evidenceType" | "sourceType";
  sortDirection: SortDirection;
};

const evidenceSortOptions = [
  "createdAt",
  "updatedAt",
  "title",
  "evidenceType",
  "sourceType",
] as const;

export function EvidenceToolbar({
  value,
  onChange,
  onCreateUrlClick,
  onCreateFileClick,
  canManageCompliance,
}: {
  value: EvidenceToolbarState;
  onChange: (value: EvidenceToolbarState) => void;
  onCreateUrlClick: () => void;
  onCreateFileClick: () => void;
  canManageCompliance: boolean;
}) {
  const t = useTranslations("evidenceToolbar");
  const tType = useTranslations("evidenceLabels.types");
  const tSource = useTranslations("evidenceLabels.sources");
  const tSort = useTranslations("evidenceLabels.sort");

  function updateValue(nextValue: Partial<EvidenceToolbarState>) {
    onChange({ ...value, ...nextValue });
  }

  return (
    <FilterBar
      actions={
        canManageCompliance ? (
          <div className="flex gap-2">
            <Button onClick={onCreateFileClick} size="sm" type="button">
              <UploadCloud className="mr-2 size-4" />
              {t("upload")}
            </Button>
            <Button
              onClick={onCreateUrlClick}
              size="sm"
              type="button"
              variant="outline"
            >
              <Link2 className="mr-2 size-4" />
              {t("url")}
            </Button>
          </div>
        ) : undefined
      }
    >
      <Input
        className="min-w-[180px] flex-1 lg:max-w-[280px]"
        placeholder={t("searchPlaceholder")}
        value={value.q}
        onChange={(event) => updateValue({ q: event.target.value })}
      />

      <Select
        value={value.evidenceType ?? ALL}
        onValueChange={(nextValue) =>
          updateValue({
            evidenceType:
              nextValue === ALL ? undefined : (nextValue as EvidenceType),
          })
        }
      >
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder={t("type")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t("allTypes")}</SelectItem>
          {evidenceTypeOptions.map((type) => (
            <SelectItem key={type} value={type}>
              {tType(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.sourceType ?? ALL}
        onValueChange={(nextValue) =>
          updateValue({
            sourceType:
              nextValue === ALL
                ? undefined
                : (nextValue as EvidenceSourceType),
          })
        }
      >
        <SelectTrigger className="min-w-[130px]">
          <SelectValue placeholder={t("source")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t("allSources")}</SelectItem>
          {evidenceSourceTypeOptions.map((sourceType) => (
            <SelectItem key={sourceType} value={sourceType}>
              {tSource(sourceType)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.sortBy}
        onValueChange={(nextValue) =>
          updateValue({
            sortBy: nextValue as EvidenceToolbarState["sortBy"],
          })
        }
      >
        <SelectTrigger className="min-w-[130px]">
          <SelectValue placeholder={t("sort")} />
        </SelectTrigger>
        <SelectContent>
          {evidenceSortOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {tSort(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.sortDirection}
        onValueChange={(nextValue) =>
          updateValue({ sortDirection: nextValue as SortDirection })
        }
      >
        <SelectTrigger className="min-w-[90px]">
          <SelectValue placeholder={t("direction")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DESC">{t("desc")}</SelectItem>
          <SelectItem value="ASC">{t("asc")}</SelectItem>
        </SelectContent>
      </Select>
    </FilterBar>
  );
}
"use client";

import { Link2, UploadCloud } from "lucide-react";

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
  evidenceSortOptions,
  evidenceSourceTypeLabels,
  evidenceSourceTypeOptions,
  evidenceTypeLabels,
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
              Upload
            </Button>
            <Button onClick={onCreateUrlClick} size="sm" type="button" variant="outline">
              <Link2 className="mr-2 size-4" />
              URL
            </Button>
          </div>
        ) : undefined
      }
    >
      <Input
        className="min-w-[180px] flex-1 lg:max-w-[280px]"
        placeholder="Search title, description, URL..."
        value={value.q}
        onChange={(e) => updateValue({ q: e.target.value })}
      />
      <Select
        value={value.evidenceType ?? ALL}
        onValueChange={(v) => updateValue({ evidenceType: v === ALL ? undefined : (v as EvidenceType) })}
      >
        <SelectTrigger className="min-w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All types</SelectItem>
          {evidenceTypeOptions.map((t) => <SelectItem key={t} value={t}>{evidenceTypeLabels[t]}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select
        value={value.sourceType ?? ALL}
        onValueChange={(v) => updateValue({ sourceType: v === ALL ? undefined : (v as EvidenceSourceType) })}
      >
        <SelectTrigger className="min-w-[130px]"><SelectValue placeholder="Source" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All sources</SelectItem>
          {evidenceSourceTypeOptions.map((s) => <SelectItem key={s} value={s}>{evidenceSourceTypeLabels[s]}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={value.sortBy} onValueChange={(v) => updateValue({ sortBy: v as EvidenceToolbarState["sortBy"] })}>
        <SelectTrigger className="min-w-[130px]"><SelectValue placeholder="Sort" /></SelectTrigger>
        <SelectContent>
          {evidenceSortOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={value.sortDirection} onValueChange={(v) => updateValue({ sortDirection: v as SortDirection })}>
        <SelectTrigger className="min-w-[90px]"><SelectValue placeholder="Dir" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="DESC">Desc</SelectItem>
          <SelectItem value="ASC">Asc</SelectItem>
        </SelectContent>
      </Select>
    </FilterBar>
  );
}
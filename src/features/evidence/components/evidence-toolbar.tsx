"use client";

import { Link2, UploadCloud } from "lucide-react";

import type {
  EvidenceSourceType,
  EvidenceType,
  SortDirection,
} from "@/lib/api/api-types";
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
    onChange({
      ...value,
      ...nextValue,
    });
  }

  return (
    <div className="rounded-3xl border bg-white p-4 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_180px_150px_auto]">
        <Input
          placeholder="Search title, description, external URL..."
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
          <SelectTrigger>
            <SelectValue placeholder="Evidence type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            {evidenceTypeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {evidenceTypeLabels[type]}
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
          <SelectTrigger>
            <SelectValue placeholder="Source type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All sources</SelectItem>
            {evidenceSourceTypeOptions.map((sourceType) => (
              <SelectItem key={sourceType} value={sourceType}>
                {evidenceSourceTypeLabels[sourceType]}
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
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {evidenceSortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
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
          <SelectTrigger>
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Desc</SelectItem>
            <SelectItem value="ASC">Asc</SelectItem>
          </SelectContent>
        </Select>

        {canManageCompliance ? (
          <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
            <Button onClick={onCreateFileClick} type="button">
              <UploadCloud className="mr-2 size-4" />
              Upload
            </Button>
            <Button onClick={onCreateUrlClick} type="button" variant="outline">
              <Link2 className="mr-2 size-4" />
              URL
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
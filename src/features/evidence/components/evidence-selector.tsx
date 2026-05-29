"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EvidenceTypeBadge } from "@/features/evidence/components/evidence-badges";
import { useEvidenceQuery } from "@/features/evidence/hooks/evidence-hooks";

export function EvidenceSelector({
  organizationId,
  linkedEvidenceIds,
  onLink,
  onClose,
  isLinking,
}: {
  organizationId: string | undefined;
  linkedEvidenceIds: Set<string>;
  onLink: (evidenceDocumentId: string) => void;
  onClose: () => void;
  isLinking: boolean;
}) {
  const [search, setSearch] = useState("");

  const params = useMemo(
    () =>
      organizationId
        ? {
            organizationId,
            page: 0,
            size: 20,
            q: search.trim() || undefined,
            sortBy: "createdAt" as const,
            sortDirection: "DESC" as const,
          }
        : undefined,
    [organizationId, search]
  );

  const evidenceQuery = useEvidenceQuery(params);
  const evidenceItems = evidenceQuery.data?.items ?? [];

  return (
    <Card className="h-fit xl:sticky xl:top-6">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Link evidence</h3>
          <Button onClick={onClose} size="sm" variant="ghost">
            Close
          </Button>
        </div>

        <div className="mt-3">
          <input
            className="w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-300 focus:bg-white"
            placeholder="Search evidence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-3 max-h-96 space-y-2 overflow-y-auto">
          {evidenceItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No evidence found.</p>
          ) : (
            evidenceItems.map((ev) => {
              const alreadyLinked = linkedEvidenceIds.has(ev.id);

              return (
                <div
                  key={ev.id}
                  className="rounded-xl border bg-slate-50 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <EvidenceTypeBadge type={ev.evidenceType} />
                      <p className="mt-1 text-sm font-medium">{ev.title}</p>
                    </div>
                    <Button
                      disabled={alreadyLinked || isLinking}
                      onClick={() => onLink(ev.id)}
                      size="sm"
                      variant={alreadyLinked ? "ghost" : "outline"}
                    >
                      {alreadyLinked ? "Linked" : "Link"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

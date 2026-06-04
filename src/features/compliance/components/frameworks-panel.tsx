"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  Layers3,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useApplyFrameworkToOrganizationMutation,
  useFrameworksQuery,
  useRequirementsQuery,
} from "@/features/compliance/hooks/compliance-hooks";
import type { FrameworkResponse } from "@/lib/api/api-types";

function frameworkBadgeLabel(framework: FrameworkResponse) {
  if (framework.code.toUpperCase().includes("ISO")) {
    return "ISO";
  }

  if (framework.code.toUpperCase().includes("SOC")) {
    return "SOC 2";
  }

  if (framework.code.toUpperCase().includes("GDPR")) {
    return "GDPR";
  }

  if (framework.code.toUpperCase().includes("SME")) {
    return "SME";
  }

  return "Template";
}

function frameworkTone(framework: FrameworkResponse) {
  const code = framework.code.toUpperCase();

  if (code.includes("ISO")) {
    return "bg-cyan-50 text-cyan-700 hover:bg-cyan-50";
  }

  if (code.includes("SOC")) {
    return "bg-violet-50 text-violet-700 hover:bg-violet-50";
  }

  if (code.includes("GDPR")) {
    return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
  }

  return "bg-slate-100 text-slate-700 hover:bg-slate-100";
}

export function FrameworksPanel({
  organizationId,
  canManageCompliance,
}: {
  organizationId: string | undefined;
  canManageCompliance: boolean;
}) {
  const frameworksQuery = useFrameworksQuery();
  const applyFrameworkMutation =
    useApplyFrameworkToOrganizationMutation(organizationId);

  const frameworks = useMemo(
    () => frameworksQuery.data ?? [],
    [frameworksQuery.data],
  );

  const [selectedFrameworkId, setSelectedFrameworkId] = useState<
    string | undefined
  >(undefined);

  const selectedFramework = useMemo(
    () =>
      frameworks.find((framework) => framework.id === selectedFrameworkId) ??
      frameworks[0],
    [frameworks, selectedFrameworkId],
  );

  const activeFrameworkId = selectedFramework?.id;

  const requirementsQuery = useRequirementsQuery(activeFrameworkId);

  function handleSelectFramework(frameworkId: string) {
    setSelectedFrameworkId(frameworkId);
  }

  function handleApplyFramework() {
    if (!activeFrameworkId) {
      return;
    }

    applyFrameworkMutation.mutate(activeFrameworkId);
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="border-b bg-white p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                <Layers3 className="size-5" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Framework templates
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight">
                  Apply a compliance baseline
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Choose a framework template and apply its requirements to this
                  workspace. Existing controls will be skipped automatically.
                </p>
              </div>
            </div>

            {canManageCompliance ? (
              <Button
                type="button"
                className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                disabled={
                  !organizationId ||
                  !activeFrameworkId ||
                  applyFrameworkMutation.isPending
                }
                onClick={handleApplyFramework}
              >
                {applyFrameworkMutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <ShieldCheck className="mr-2 size-4" />
                )}
                Apply to workspace
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[360px_1fr]">
          <div className="border-b bg-slate-50/70 p-4 lg:border-b-0 lg:border-r">
            {frameworksQuery.error ? (
              <ErrorAlert error={frameworksQuery.error} />
            ) : null}

            {frameworksQuery.isLoading ? (
              <div className="flex items-center gap-2 rounded-2xl border bg-white p-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading frameworks...
              </div>
            ) : frameworks.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-white p-6 text-center">
                <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                  <ClipboardList className="size-5" />
                </div>
                <h4 className="mt-4 font-semibold">No frameworks yet</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ask a platform admin to seed or create compliance templates.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {frameworks.map((framework) => {
                  const isSelected = framework.id === activeFrameworkId;

                  return (
                    <button
                      key={framework.id}
                      type="button"
                      onClick={() => handleSelectFramework(framework.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-cyan-300 bg-white shadow-sm"
                          : "border-transparent bg-white/70 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-semibold">
                              {framework.name}
                            </p>

                            {isSelected ? (
                              <CheckCircle2 className="size-4 shrink-0 text-cyan-700" />
                            ) : null}
                          </div>

                          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {framework.code}
                          </p>
                        </div>

                        <Badge
                          variant="secondary"
                          className={frameworkTone(framework)}
                        >
                          {frameworkBadgeLabel(framework)}
                        </Badge>
                      </div>

                      {framework.description ? (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {framework.description}
                        </p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-5">
            {!selectedFramework ? (
              <div className="rounded-2xl border border-dashed p-8 text-center">
                <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                  <FileText className="size-5" />
                </div>

                <h4 className="mt-4 font-semibold">Select a framework</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pick a template to preview its requirements.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex flex-col justify-between gap-3 border-b pb-4 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-semibold">
                        {selectedFramework.name}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={frameworkTone(selectedFramework)}
                      >
                        {selectedFramework.code}
                      </Badge>
                    </div>

                    {selectedFramework.description ? (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                        {selectedFramework.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <p className="font-semibold">
                      {requirementsQuery.data?.length ?? 0}
                    </p>
                    <p className="text-muted-foreground">Requirements</p>
                  </div>
                </div>

                <div className="mt-5">
                  {requirementsQuery.error ? (
                    <ErrorAlert error={requirementsQuery.error} />
                  ) : null}

                  {requirementsQuery.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Loading requirements...
                    </div>
                  ) : (requirementsQuery.data ?? []).length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-8 text-center">
                      <h4 className="font-semibold">No requirements</h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        This framework has no requirements yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(requirementsQuery.data ?? []).map((requirement) => (
                        <div
                          key={requirement.id}
                          className="rounded-2xl border bg-white p-4"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">
                                  {requirement.code}
                                </Badge>

                                {requirement.category ? (
                                  <Badge variant="secondary">
                                    {requirement.category}
                                  </Badge>
                                ) : null}
                              </div>

                              <h5 className="mt-3 font-semibold">
                                {requirement.title}
                              </h5>

                              {requirement.description ? (
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                  {requirement.description}
                                </p>
                              ) : null}
                            </div>

                            <div className="shrink-0 rounded-xl bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                              Order {requirement.sortOrder}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {applyFrameworkMutation.error ? (
              <div className="mt-4">
                <ErrorAlert error={applyFrameworkMutation.error} />
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

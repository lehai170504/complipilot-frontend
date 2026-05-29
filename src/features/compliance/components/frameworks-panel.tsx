"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, ChevronDown, ChevronRight, Plus } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateFrameworkMutation,
  useCreateRequirementMutation,
  useFrameworksQuery,
  useRequirementsQuery,
} from "@/features/compliance/hooks/compliance-hooks";
import {
  createFrameworkSchema,
  createRequirementSchema,
  type CreateFrameworkFormData,
  type CreateRequirementFormData,
} from "@/lib/validation-schemas";

export function FrameworksPanel() {
  const frameworksQuery = useFrameworksQuery();
  const frameworks = frameworksQuery.data ?? [];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Compliance frameworks</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {frameworks.length} framework{frameworks.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <CreateFrameworkButton />
        </div>

        {frameworksQuery.isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading frameworks...</p>
        ) : frameworks.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No frameworks yet. Seed the security baseline or create a custom framework.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {frameworks.map((fw) => (
              <FrameworkRow
                key={fw.id}
                framework={fw}
                isExpanded={expandedId === fw.id}
                onToggle={() =>
                  setExpandedId(expandedId === fw.id ? null : fw.id)
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FrameworkRow({
  framework,
  isExpanded,
  onToggle,
}: {
  framework: { id: string; code: string; name: string; description: string | null; systemTemplate: boolean };
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const requirementsQuery = useRequirementsQuery(
    isExpanded ? framework.id : undefined
  );

  return (
    <div className="rounded-xl border bg-slate-50">
      <button
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={onToggle}
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-cyan-300">
            <BookOpen className="size-4" />
          </div>
          <div>
            <p className="truncate font-semibold">{framework.name}</p>
            <p className="truncate text-xs text-muted-foreground">{framework.code}</p>
          </div>
          {framework.systemTemplate ? (
            <Badge className="bg-cyan-50 text-cyan-700 hover:bg-cyan-50" variant="secondary">
              Template
            </Badge>
          ) : null}
        </div>
        {isExpanded ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
      </button>

      {isExpanded ? (
        <div className="border-t px-4 pb-4">
          {framework.description ? (
            <p className="py-3 text-sm text-muted-foreground">{framework.description}</p>
          ) : null}

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Requirements ({requirementsQuery.data?.length ?? 0})
            </p>
            <CreateRequirementButton frameworkId={framework.id} />
          </div>

          {requirementsQuery.isLoading ? (
            <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
          ) : requirementsQuery.data?.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No requirements yet.</p>
          ) : (
            <div className="mt-2 space-y-1">
              {requirementsQuery.data?.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm"
                >
                  <span className="shrink-0 rounded-full bg-slate-950 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                    {req.code}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{req.title}</span>
                  {req.category ? (
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{req.category}</span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function CreateFrameworkButton() {
  const createMutation = useCreateFrameworkMutation();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFrameworkFormData>({
    resolver: zodResolver(createFrameworkSchema),
    defaultValues: { code: "", name: "", description: "" },
  });

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} size="sm" variant="outline">
        <Plus className="mr-2 size-4" />New framework
      </Button>
    );
  }

  function onSubmit(data: CreateFrameworkFormData) {
    createMutation.mutate(
      { code: data.code.trim(), name: data.name.trim(), description: data.description?.trim() || null },
      { onSuccess: () => { setShowForm(false); reset(); } }
    );
  }

  return (
    <form className="rounded-xl border bg-white p-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Code</Label>
          <Input {...register("code")} placeholder="SEC-BASIC" />
          {errors.code ? <p className="text-xs text-red-600">{errors.code.message}</p> : null}
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Name</Label>
          <Input {...register("name")} placeholder="Security Baseline" />
          {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Description</Label>
        <Input {...register("description")} placeholder="Optional..." />
      </div>
      {createMutation.error ? <ErrorAlert error={createMutation.error} /> : null}
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={() => setShowForm(false)} type="button">Cancel</Button>
        <Button size="sm" disabled={isSubmitting || createMutation.isPending} type="submit">
          {createMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}

function CreateRequirementButton({ frameworkId }: { frameworkId: string }) {
  const createMutation = useCreateRequirementMutation(frameworkId);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("1");

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} size="sm" variant="ghost">
        <Plus className="mr-1 size-3" />
        Add
      </Button>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_80px] gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="SEC-006" size={10} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Order</Label>
            <Input value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} type="number" size={5} />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Requirement title" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Category (optional)</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Access Control" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Description (optional)</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional..." />
        </div>
        {createMutation.error ? <ErrorAlert error={createMutation.error} /> : null}
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button
            size="sm"
            disabled={!code.trim() || !title.trim() || createMutation.isPending}
            onClick={() => {
              createMutation.mutate(
                {
                  code: code.trim(),
                  title: title.trim(),
                  description: description.trim() || null,
                  category: category.trim() || null,
                  sortOrder: parseInt(sortOrder) || 1,
                },
                { onSuccess: () => { setShowForm(false); setCode(""); setTitle(""); setDescription(""); setCategory(""); setSortOrder("1"); } }
              );
            }}
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}

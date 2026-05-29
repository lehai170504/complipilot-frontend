"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

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
  type CreateFrameworkFormData,
} from "@/lib/validation-schemas";

export function FrameworksPanel() {
  const t = useTranslations("frameworksPanel");
  const frameworksQuery = useFrameworksQuery();
  const frameworks = frameworksQuery.data ?? [];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{t("title")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("available", { count: frameworks.length })}
            </p>
          </div>
          <CreateFrameworkButton />
        </div>

        {frameworksQuery.isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("loading")}</p>
        ) : frameworks.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="mt-4 space-y-2">
            {frameworks.map((framework) => (
              <FrameworkRow
                key={framework.id}
                framework={framework}
                isExpanded={expandedId === framework.id}
                onToggle={() =>
                  setExpandedId(
                    expandedId === framework.id ? null : framework.id,
                  )
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
  framework: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    systemTemplate: boolean;
  };
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("frameworksPanel");
  const requirementsQuery = useRequirementsQuery(
    isExpanded ? framework.id : undefined,
  );

  return (
    <div className="rounded-xl border bg-slate-50">
      <button
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={onToggle}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-cyan-300">
            <BookOpen className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{framework.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {framework.code}
            </p>
          </div>
          {framework.systemTemplate ? (
            <Badge
              className="bg-cyan-50 text-cyan-700 hover:bg-cyan-50"
              variant="secondary"
            >
              {t("template")}
            </Badge>
          ) : null}
        </div>
        {isExpanded ? (
          <ChevronDown className="size-5 shrink-0" />
        ) : (
          <ChevronRight className="size-5 shrink-0" />
        )}
      </button>

      {isExpanded ? (
        <div className="border-t px-4 pb-4">
          {framework.description ? (
            <p className="py-3 text-sm text-muted-foreground">
              {framework.description}
            </p>
          ) : null}

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {t("requirements", {
                count: requirementsQuery.data?.length ?? 0,
              })}
            </p>
            <CreateRequirementButton frameworkId={framework.id} />
          </div>

          {requirementsQuery.isLoading ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("loadingShort")}
            </p>
          ) : requirementsQuery.data?.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("noRequirements")}
            </p>
          ) : (
            <div className="mt-2 space-y-1">
              {requirementsQuery.data?.map((requirement) => (
                <div
                  key={requirement.id}
                  className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm"
                >
                  <span className="shrink-0 rounded-full bg-slate-950 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                    {requirement.code}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {requirement.title}
                  </span>
                  {requirement.category ? (
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                      {requirement.category}
                    </span>
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
  const t = useTranslations("frameworksPanel");
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
        <Plus className="mr-2 size-4" />
        {t("newFramework")}
      </Button>
    );
  }

  function onSubmit(data: CreateFrameworkFormData) {
    createMutation.mutate(
      {
        code: data.code.trim(),
        name: data.name.trim(),
        description: data.description?.trim() || null,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          reset();
        },
      },
    );
  }

  return (
    <form
      className="space-y-3 rounded-xl border bg-white p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">{t("fields.code")}</Label>
          <Input
            {...register("code")}
            placeholder={t("placeholders.frameworkCode")}
          />
          {errors.code ? (
            <p className="text-xs text-red-600">{errors.code.message}</p>
          ) : null}
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{t("fields.name")}</Label>
          <Input
            {...register("name")}
            placeholder={t("placeholders.frameworkName")}
          />
          {errors.name ? (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t("fields.description")}</Label>
        <Input
          {...register("description")}
          placeholder={t("placeholders.optional")}
        />
      </div>

      {createMutation.error ? (
        <ErrorAlert error={createMutation.error} />
      ) : null}

      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowForm(false)}
          type="button"
        >
          {t("cancel")}
        </Button>
        <Button
          size="sm"
          disabled={isSubmitting || createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? t("creating") : t("create")}
        </Button>
      </div>
    </form>
  );
}

function CreateRequirementButton({ frameworkId }: { frameworkId: string }) {
  const t = useTranslations("frameworksPanel");
  const createMutation = useCreateRequirementMutation(frameworkId);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("1");

  function resetRequirementForm() {
    setCode("");
    setTitle("");
    setDescription("");
    setCategory("");
    setSortOrder("1");
  }

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} size="sm" variant="ghost">
        <Plus className="mr-1 size-3" />
        {t("add")}
      </Button>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_80px] gap-2">
          <div className="space-y-1">
            <Label className="text-xs">{t("fields.code")}</Label>
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder={t("placeholders.requirementCode")}
              size={10}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t("fields.order")}</Label>
            <Input
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              type="number"
              size={5}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t("fields.title")}</Label>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("placeholders.requirementTitle")}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t("fields.categoryOptional")}</Label>
          <Input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder={t("placeholders.category")}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t("fields.descriptionOptional")}</Label>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("placeholders.optional")}
          />
        </div>

        {createMutation.error ? (
          <ErrorAlert error={createMutation.error} />
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowForm(false);
              resetRequirementForm();
            }}
            type="button"
          >
            {t("cancel")}
          </Button>
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
                  sortOrder: parseInt(sortOrder, 10) || 1,
                },
                {
                  onSuccess: () => {
                    setShowForm(false);
                    resetRequirementForm();
                  },
                },
              );
            }}
            type="button"
          >
            {createMutation.isPending ? t("creating") : t("create")}
          </Button>
        </div>
      </div>
    </div>
  );
}

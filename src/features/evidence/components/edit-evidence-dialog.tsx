"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { evidenceTypeOptions } from "@/features/evidence/constants";
import { useUpdateEvidenceMutation } from "@/features/evidence/hooks/evidence-hooks";
import {
  editEvidenceSchema,
  type EditEvidenceFormData,
} from "@/lib/validation-schemas";
import type { EvidenceDocument, EvidenceType } from "@/lib/api/api-types";

export function EditEvidenceDialog({
  open,
  onOpenChange,
  organizationId,
  evidence,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
  evidence: EvidenceDocument | null;
}) {
  const t = useTranslations("evidenceEditDialog");
  const tType = useTranslations("evidenceLabels.types");

  const updateMutation = useUpdateEvidenceMutation(organizationId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditEvidenceFormData>({
    resolver: zodResolver(editEvidenceSchema),
  });

  useEffect(() => {
    if (evidence) {
      reset({
        title: evidence.title,
        description: evidence.description ?? "",
        evidenceType: evidence.evidenceType,
        externalUrl: evidence.externalUrl ?? "",
      });
    }
  }, [evidence, reset]);

  function onSubmit(data: EditEvidenceFormData) {
    if (!evidence) return;

    updateMutation.mutate(
      {
        evidenceId: evidence.id,
        request: {
          title: data.title.trim(),
          description: data.description?.trim() || null,
          evidenceType: data.evidenceType as EvidenceType,
          externalUrl:
            evidence.sourceType === "URL"
              ? data.externalUrl?.trim() || null
              : null,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="edit-evidence-title">{t("titleLabel")}</Label>
            <Input id="edit-evidence-title" {...register("title")} />
            {errors.title ? (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-evidence-type">{t("type")}</Label>
            <Controller
              name="evidenceType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="edit-evidence-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {evidenceTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {tType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {evidence?.sourceType === "URL" ? (
            <div className="space-y-2">
              <Label htmlFor="edit-external-url">{t("externalUrl")}</Label>
              <Input
                id="edit-external-url"
                type="url"
                {...register("externalUrl")}
              />
              {errors.externalUrl ? (
                <p className="text-sm text-destructive">
                  {errors.externalUrl.message}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="edit-evidence-desc">{t("descriptionLabel")}</Label>
            <Textarea
              id="edit-evidence-desc"
              {...register("description")}
              rows={4}
            />
            {errors.description ? (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          {updateMutation.error ? (
            <ErrorAlert error={updateMutation.error} />
          ) : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              disabled={isSubmitting || updateMutation.isPending}
              type="submit"
            >
              {updateMutation.isPending ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

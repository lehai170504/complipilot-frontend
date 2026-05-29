"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  evidenceTypeLabels,
  evidenceTypeOptions,
} from "@/features/evidence/constants";
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

  useEffect(() => {
    if (updateMutation.isSuccess) {
      onOpenChange(false);
    }
  }, [updateMutation.isSuccess, onOpenChange]);

  function onSubmit(data: EditEvidenceFormData) {
    if (!evidence) return;
    updateMutation.mutate({
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
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit evidence</DialogTitle>
          <DialogDescription>
            Update metadata for this evidence document.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="edit-evidence-title">Title</Label>
            <Input id="edit-evidence-title" {...register("title")} />
            {errors.title ? (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-evidence-type">Evidence type</Label>
            <Controller
              name="evidenceType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="edit-evidence-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {evidenceTypeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {evidenceTypeLabels[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {evidence?.sourceType === "URL" ? (
            <div className="space-y-2">
              <Label htmlFor="edit-external-url">External URL</Label>
              <Input
                id="edit-external-url"
                type="url"
                {...register("externalUrl")}
              />
              {errors.externalUrl ? (
                <p className="text-sm text-red-600">
                  {errors.externalUrl.message}
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="edit-evidence-desc">Description</Label>
            <Textarea
              id="edit-evidence-desc"
              {...register("description")}
              rows={4}
            />
            {errors.description ? (
              <p className="text-sm text-red-600">
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
              Cancel
            </Button>
            <Button
              disabled={isSubmitting || updateMutation.isPending}
              type="submit"
            >
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

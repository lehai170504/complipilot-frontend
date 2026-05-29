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
import { useCreateEvidenceMutation } from "@/features/evidence/hooks/evidence-hooks";
import { urlEvidenceSchema, type UrlEvidenceFormData } from "@/lib/validation-schemas";

export function CreateUrlEvidenceDialog({
  open,
  onOpenChange,
  organizationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
}) {
  const createEvidenceMutation = useCreateEvidenceMutation(organizationId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UrlEvidenceFormData>({
    resolver: zodResolver(urlEvidenceSchema),
    defaultValues: {
      title: "MFA configuration guide",
      description: "URL evidence for MFA configuration and access control review.",
      externalUrl: "https://example.com/security/mfa-guide",
      evidenceType: "PROCEDURE",
    },
  });

  useEffect(() => {
    if (createEvidenceMutation.isSuccess) {
      onOpenChange(false);
      reset();
    }
  }, [createEvidenceMutation.isSuccess, onOpenChange, reset]);

  function onSubmit(data: UrlEvidenceFormData) {
    createEvidenceMutation.mutate({
      title: data.title,
      description: data.description?.trim() || null,
      evidenceType: data.evidenceType as Parameters<typeof createEvidenceMutation.mutate>[0]["evidenceType"],
      sourceType: "URL",
      externalUrl: data.externalUrl,
      fileObjectKey: null,
      contentType: null,
      fileSizeBytes: null,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add URL evidence</DialogTitle>
          <DialogDescription>
            Create evidence metadata for an external URL.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="evidence-title">Title</Label>
            <Input id="evidence-title" {...register("title")} />
            {errors.title ? <p className="text-sm text-red-600">{errors.title.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence-type">Evidence type</Label>
            <Controller
              name="evidenceType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="evidence-type">
                    <SelectValue placeholder="Select evidence type" />
                  </SelectTrigger>
                  <SelectContent>
                    {evidenceTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {evidenceTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="external-url">External URL</Label>
            <Input id="external-url" type="url" {...register("externalUrl")} />
            {errors.externalUrl ? <p className="text-sm text-red-600">{errors.externalUrl.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence-description">Description</Label>
            <Textarea id="evidence-description" {...register("description")} rows={4} />
            {errors.description ? <p className="text-sm text-red-600">{errors.description.message}</p> : null}
          </div>

          {createEvidenceMutation.error ? (
            <ErrorAlert error={createEvidenceMutation.error} />
          ) : null}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={isSubmitting || createEvidenceMutation.isPending} type="submit">
              {createEvidenceMutation.isPending ? "Creating..." : "Create evidence"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
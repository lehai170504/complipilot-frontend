"use client";

import { FormEvent, useEffect, useState } from "react";

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
import type { EvidenceType } from "@/lib/api/api-types";

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

  const [title, setTitle] = useState("MFA configuration guide");
  const [description, setDescription] = useState(
    "URL evidence for MFA configuration and access control review."
  );
  const [externalUrl, setExternalUrl] = useState(
    "https://example.com/security/mfa-guide"
  );
  const [evidenceType, setEvidenceType] = useState<EvidenceType>("PROCEDURE");

  useEffect(() => {
    if (createEvidenceMutation.isSuccess) {
      onOpenChange(false);
    }
  }, [createEvidenceMutation.isSuccess, onOpenChange]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createEvidenceMutation.mutate({
      title,
      description: description.trim() ? description.trim() : null,
      evidenceType,
      sourceType: "URL",
      externalUrl,
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
            Create evidence metadata for an external URL. File upload will be
            added in the next step.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="evidence-title">Title</Label>
            <Input
              id="evidence-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence-type">Evidence type</Label>
            <Select
              value={evidenceType}
              onValueChange={(value) => setEvidenceType(value as EvidenceType)}
            >
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="external-url">External URL</Label>
            <Input
              id="external-url"
              type="url"
              value={externalUrl}
              onChange={(event) => setExternalUrl(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence-description">Description</Label>
            <Textarea
              id="evidence-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          {createEvidenceMutation.error ? (
            <ErrorAlert error={createEvidenceMutation.error} />
          ) : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button disabled={createEvidenceMutation.isPending} type="submit">
              {createEvidenceMutation.isPending ? "Creating..." : "Create evidence"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
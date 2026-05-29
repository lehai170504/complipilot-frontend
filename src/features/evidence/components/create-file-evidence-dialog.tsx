"use client";

import { FormEvent, useState } from "react";
import { FileUp, X } from "lucide-react";

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
import { useCreateFileEvidenceMutation } from "@/features/evidence/hooks/evidence-hooks";
import type { EvidenceType } from "@/lib/api/api-types";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function CreateFileEvidenceDialog({
  open,
  onOpenChange,
  organizationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
}) {
  const createFileEvidenceMutation =
    useCreateFileEvidenceMutation(organizationId);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceType, setEvidenceType] = useState<EvidenceType>("SCREENSHOT");
  const [clientError, setClientError] = useState<string | null>(null);

  function resetForm() {
    setFile(null);
    setTitle("");
    setDescription("");
    setEvidenceType("SCREENSHOT");
    setClientError(null);
  }

  function handleFileChange(selectedFile: File | null) {
    setClientError(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setClientError("File size must be 10MB or smaller.");
      setFile(null);
      return;
    }

    setFile(selectedFile);

    if (!title.trim()) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanName);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientError(null);

    if (!file) {
      setClientError("Please choose a file to upload.");
      return;
    }

    if (!organizationId) {
      setClientError("Missing active organization.");
      return;
    }

    createFileEvidenceMutation.mutate(
      {
        file,
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
        evidenceType,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
        },
      },
    );
  }

  const isSubmitting = createFileEvidenceMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload file evidence</DialogTitle>
          <DialogDescription>
            Upload a file through a secure presigned URL, then create evidence
            metadata in CompliPilot.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="evidence-file">File</Label>

            {!file ? (
              <label
                className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed bg-slate-50 p-8 text-center hover:bg-slate-100"
                htmlFor="evidence-file"
              >
                <div className="rounded-2xl bg-white p-3 text-cyan-700 shadow-sm">
                  <FileUp className="size-6" />
                </div>
                <p className="mt-3 font-medium">Choose evidence file</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  PDF, image, document, or report. Max 10MB.
                </p>
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-3xl border bg-slate-50 p-4">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {file.type || "application/octet-stream"} ·{" "}
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <Button
                  onClick={() => handleFileChange(null)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}

            <Input
              id="evidence-file"
              className="hidden"
              type="file"
              onChange={(event) =>
                handleFileChange(event.target.files?.[0] ?? null)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-evidence-title">Title</Label>
            <Input
              id="file-evidence-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="MFA screenshot"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-evidence-type">Evidence type</Label>
            <Select
              value={evidenceType}
              onValueChange={(value) => setEvidenceType(value as EvidenceType)}
            >
              <SelectTrigger id="file-evidence-type">
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
            <Label htmlFor="file-evidence-description">Description</Label>
            <Textarea
              id="file-evidence-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What does this evidence prove?"
              rows={4}
            />
          </div>

          {clientError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {clientError}
            </div>
          ) : null}

          {createFileEvidenceMutation.error ? (
            <ErrorAlert error={createFileEvidenceMutation.error} />
          ) : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting || !file} type="submit">
              {isSubmitting ? "Uploading..." : "Upload evidence"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

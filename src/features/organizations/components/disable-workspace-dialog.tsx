"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

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
import { useDisableOrganizationWorkspaceMutation } from "@/features/organizations/hooks/organization-settings-hooks";

export function DisableWorkspaceDialog({
  open,
  onOpenChange,
  organizationId,
  workspaceName,
  onDisabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
  workspaceName: string;
  onDisabled?: () => void;
}) {
  const disableMutation =
    useDisableOrganizationWorkspaceMutation(organizationId);
  const [confirmation, setConfirmation] = useState("");

  const canSubmit = confirmation === "DISABLE" && Boolean(organizationId);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen && !disableMutation.isPending) {
      setConfirmation("");
      disableMutation.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    disableMutation.mutate(
      {
        confirmation,
      },
      {
        onSuccess: () => {
          onDisabled?.();
          handleOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="size-5 text-red-600" />
            Disable workspace
          </DialogTitle>
          <DialogDescription>
            This will disable the workspace without deleting its data. Members
            should not continue operating in this workspace after it is
            disabled.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Danger zone action</p>
          <p className="mt-1 leading-6">
            You are about to disable{" "}
            <span className="font-semibold">{workspaceName}</span>. This action
            is recorded in the audit trail.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="disable-confirmation">
              Type <span className="font-semibold">DISABLE</span> to confirm
            </Label>
            <Input
              id="disable-confirmation"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="DISABLE"
              autoComplete="off"
            />
          </div>

          {disableMutation.error ? (
            <ErrorAlert error={disableMutation.error} />
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={disableMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="destructive"
              disabled={!canSubmit || disableMutation.isPending}
            >
              {disableMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <AlertTriangle className="mr-2 size-4" />
              )}
              Disable workspace
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { MailPlus } from "lucide-react";

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
import type { OrganizationMemberRole } from "@/features/organizations/api/organization-members-api";
import { useCreateOrganizationInvitationMutation } from "@/features/organizations/hooks/organization-invitation-hooks";

const roleOptions: OrganizationMemberRole[] = [
  "ADMIN",
  "COMPLIANCE_MANAGER",
  "MEMBER",
  "AUDITOR",
];

function roleLabel(role: OrganizationMemberRole) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "COMPLIANCE_MANAGER":
      return "Compliance Manager";
    case "AUDITOR":
      return "Auditor";
    case "MEMBER":
      return "Member";
    case "OWNER":
      return "Owner";
    default:
      return role;
  }
}

export function CreateOrganizationInvitationDialog({
  open,
  onOpenChange,
  organizationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
}) {
  const createMutation =
    useCreateOrganizationInvitationMutation(organizationId);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrganizationMemberRole>("MEMBER");
  const [createdInviteUrl, setCreatedInviteUrl] = useState<string | null>(null);

  function resetForm() {
    setEmail("");
    setRole("MEMBER");
    setCreatedInviteUrl(null);
    createMutation.reset();
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen && !createMutation.isPending) {
      resetForm();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createMutation.mutate(
      {
        email: email.trim(),
        role,
      },
      {
        onSuccess: (response) => {
          setCreatedInviteUrl(response.inviteUrl);
        },
      },
    );
  }

  async function handleCopyInviteLink() {
    if (!createdInviteUrl) {
      return;
    }

    await navigator.clipboard.writeText(createdInviteUrl);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Send an invitation link to add a new member to this workspace.
          </DialogDescription>
        </DialogHeader>

        {createdInviteUrl ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <p className="font-semibold">Invitation created</p>
              <p className="mt-1">
                Copy this link and send it to the invited member.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Invitation link</Label>
              <Input readOnly value={createdInviteUrl} />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>

              <Button type="button" onClick={handleCopyInviteLink}>
                Copy link
              </Button>
            </div>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="invitation-email">Email</Label>
              <Input
                id="invitation-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="auditor@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(value) =>
                  setRole(value as OrganizationMemberRole)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {roleLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {createMutation.error ? (
              <ErrorAlert error={createMutation.error} />
            ) : null}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!email.trim() || createMutation.isPending}
              >
                <MailPlus className="mr-2 size-4" />
                {createMutation.isPending ? "Creating..." : "Create invite"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

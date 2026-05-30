"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
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
import {
  useCreateOrganizationMemberMutation,
} from "@/features/organizations/hooks/organization-members-hooks";
import type { OrganizationMemberRole } from "@/features/organizations/api/organization-members-api";

const roleOptions: OrganizationMemberRole[] = [
  "ADMIN",
  "COMPLIANCE_MANAGER",
  "MEMBER",
  "AUDITOR",
];

export function CreateOrganizationMemberDialog({
  open,
  onOpenChange,
  organizationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
}) {
  const t = useTranslations("members");
  const tCommon = useTranslations("common");
  const tStatus = useTranslations("status");

  const createMutation = useCreateOrganizationMemberMutation(organizationId);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Password123!");
  const [role, setRole] = useState<OrganizationMemberRole>("MEMBER");

  function resetForm() {
    setFullName("");
    setEmail("");
    setPassword("Password123!");
    setRole("MEMBER");
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
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription>{t("dialog.description")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="member-full-name">{t("fields.fullName")}</Label>
            <Input
              id="member-full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Demo Auditor"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-email">{t("fields.email")}</Label>
            <Input
              id="member-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="auditor@complipilot.dev"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("fields.role")}</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as OrganizationMemberRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {tStatus(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-password">{t("fields.password")}</Label>
              <Input
                id="member-password"
                type="text"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </div>

          {createMutation.error ? <ErrorAlert error={createMutation.error} /> : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={
                !fullName.trim() ||
                !email.trim() ||
                !password.trim() ||
                createMutation.isPending
              }
            >
              <Plus className="mr-2 size-4" />
              {createMutation.isPending ? tCommon("creating") : t("dialog.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

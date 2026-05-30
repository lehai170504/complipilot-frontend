"use client";

import { useState } from "react";
import { ShieldCheck, Trash2, UserPlus, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  OrganizationMemberRole,
  OrganizationMemberStatus,
} from "@/features/organizations/api/organization-members-api";
import { CreateOrganizationMemberDialog } from "@/features/organizations/components/create-organization-member-dialog";
import { SeedDemoUsersButton } from "@/features/organizations/components/seed-demo-users-button";
import {
  useDeleteOrganizationMemberMutation,
  useOrganizationMembersQuery,
  useUpdateOrganizationMemberRoleMutation,
  useUpdateOrganizationMemberStatusMutation,
} from "@/features/organizations/hooks/organization-members-hooks";

const roleOptions: OrganizationMemberRole[] = [
  "OWNER",
  "ADMIN",
  "COMPLIANCE_MANAGER",
  "MEMBER",
  "AUDITOR",
];

const statusOptions: OrganizationMemberStatus[] = [
  "ACTIVE",
  "INVITED",
  "DISABLED",
];

export function OrganizationMembersPanel({
  organizationId,
  canManageMembers,
}: {
  organizationId: string | undefined;
  canManageMembers: boolean;
}) {
  const t = useTranslations("members");
  const tStatus = useTranslations("status");

  const membersQuery = useOrganizationMembersQuery(organizationId);
  const updateRoleMutation = useUpdateOrganizationMemberRoleMutation(organizationId);
  const updateStatusMutation = useUpdateOrganizationMemberStatusMutation(organizationId);
  const deleteMutation = useDeleteOrganizationMemberMutation(organizationId);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const members = membersQuery.data ?? [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                <UsersRound className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t("title")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("description")}
                </p>
              </div>
            </div>
          </div>

          {canManageMembers ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <SeedDemoUsersButton organizationId={organizationId} />
              <Button
                type="button"
                size="sm"
                className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <UserPlus className="mr-2 size-4" />
                {t("addMember")}
              </Button>
            </div>
          ) : null}
        </div>

        {membersQuery.error ? (
          <div className="mt-4">
            <ErrorAlert error={membersQuery.error} />
          </div>
        ) : null}

        {membersQuery.isLoading ? (
          <p className="mt-5 text-sm text-muted-foreground">{t("loading")}</p>
        ) : members.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border">
            <div className="hidden grid-cols-[1.4fr_180px_160px_110px] gap-3 border-b bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">
              <span>{t("columns.member")}</span>
              <span>{t("columns.role")}</span>
              <span>{t("columns.status")}</span>
              <span className="text-right">{t("columns.actions")}</span>
            </div>

            <div className="divide-y">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="grid gap-3 px-4 py-4 lg:grid-cols-[1.4fr_180px_160px_110px] lg:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{member.fullName}</p>
                      {member.role === "OWNER" ? (
                        <ShieldCheck className="size-4 text-cyan-600" />
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>

                  {canManageMembers ? (
                    <Select
                      value={member.role}
                      onValueChange={(role) =>
                        updateRoleMutation.mutate({
                          memberId: member.id,
                          role: role as OrganizationMemberRole,
                        })
                      }
                      disabled={updateRoleMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role} value={role}>
                            {tStatus(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary">{tStatus(member.role)}</Badge>
                  )}

                  {canManageMembers ? (
                    <Select
                      value={member.status}
                      onValueChange={(status) =>
                        updateStatusMutation.mutate({
                          memberId: member.id,
                          status: status as OrganizationMemberStatus,
                        })
                      }
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {tStatus(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {tStatus(member.status)}
                    </span>
                  )}

                  <div className="flex justify-end">
                    {canManageMembers ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(member.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(updateRoleMutation.error || updateStatusMutation.error || deleteMutation.error) ? (
          <div className="mt-4">
            <ErrorAlert
              error={
                updateRoleMutation.error ??
                updateStatusMutation.error ??
                deleteMutation.error
              }
            />
          </div>
        ) : null}

        <CreateOrganizationMemberDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          organizationId={organizationId}
        />
      </CardContent>
    </Card>
  );
}

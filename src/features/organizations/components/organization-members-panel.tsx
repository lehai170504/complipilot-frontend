"use client";

import { useState } from "react";
import {
  Copy,
  ExternalLink,
  Mail,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound,
  XCircle,
} from "lucide-react";
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
import { CreateOrganizationInvitationDialog } from "@/features/organizations/components/create-organization-invitation-dialog";
import { SeedDemoUsersButton } from "@/features/organizations/components/seed-demo-users-button";
import type {
  OrganizationMemberRole,
  OrganizationMemberStatus,
} from "@/features/organizations/api/organization-members-api";
import {
  useDeleteOrganizationMemberMutation,
  useOrganizationMembersQuery,
  useUpdateOrganizationMemberRoleMutation,
  useUpdateOrganizationMemberStatusMutation,
} from "@/features/organizations/hooks/organization-members-hooks";
import {
  useOrganizationInvitationsQuery,
  useRevokeOrganizationInvitationMutation,
} from "@/features/organizations/hooks/organization-invitation-hooks";

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

type PanelTab = "members" | "invitations";

function roleLabel(role: OrganizationMemberRole) {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "ADMIN":
      return "Admin";
    case "COMPLIANCE_MANAGER":
      return "Compliance Manager";
    case "MEMBER":
      return "Member";
    case "AUDITOR":
      return "Auditor";
    default:
      return role;
  }
}

function statusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getInviteUrl(invitation: {
  acceptUrl?: string | null;
  invitationToken?: string | null;
}) {
  if (invitation.acceptUrl) {
    return invitation.acceptUrl;
  }

  if (invitation.invitationToken) {
    return `${window.location.origin}/invite/${invitation.invitationToken}`;
  }

  return null;
}

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
  const invitationsQuery = useOrganizationInvitationsQuery(organizationId);

  const updateRoleMutation =
    useUpdateOrganizationMemberRoleMutation(organizationId);
  const updateStatusMutation =
    useUpdateOrganizationMemberStatusMutation(organizationId);
  const deleteMutation = useDeleteOrganizationMemberMutation(organizationId);
  const revokeInvitationMutation =
    useRevokeOrganizationInvitationMutation(organizationId);

  const [activeTab, setActiveTab] = useState<PanelTab>("members");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [copiedInvitationId, setCopiedInvitationId] = useState<string | null>(
    null,
  );

  const members = membersQuery.data ?? [];
  const invitations = invitationsQuery.data ?? [];

  async function handleCopyInviteLink(
    invitationId: string,
    inviteUrl: string | null,
  ) {
    if (!inviteUrl) {
      return;
    }

    await navigator.clipboard.writeText(inviteUrl);
    setCopiedInvitationId(invitationId);

    window.setTimeout(() => {
      setCopiedInvitationId((current) =>
        current === invitationId ? null : current,
      );
    }, 2000);
  }

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
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <UserPlus className="mr-2 size-4" />
                Invite member
              </Button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeTab === "members" ? "default" : "outline"}
            onClick={() => setActiveTab("members")}
          >
            Members
          </Button>

          <Button
            type="button"
            size="sm"
            variant={activeTab === "invitations" ? "default" : "outline"}
            onClick={() => setActiveTab("invitations")}
          >
            Invitations
            {invitations.length > 0 ? (
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                {invitations.length}
              </span>
            ) : null}
          </Button>
        </div>

        {activeTab === "members" ? (
          <>
            {membersQuery.error ? (
              <div className="mt-4">
                <ErrorAlert error={membersQuery.error} />
              </div>
            ) : null}

            {membersQuery.isLoading ? (
              <p className="mt-5 text-sm text-muted-foreground">
                {t("loading")}
              </p>
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
                          <p className="truncate font-semibold">
                            {member.fullName}
                          </p>

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
                        <Badge variant="secondary">
                          {tStatus(member.role)}
                        </Badge>
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

            {updateRoleMutation.error ||
            updateStatusMutation.error ||
            deleteMutation.error ? (
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
          </>
        ) : (
          <>
            {invitationsQuery.error ? (
              <div className="mt-4">
                <ErrorAlert error={invitationsQuery.error} />
              </div>
            ) : null}

            {invitationsQuery.isLoading ? (
              <p className="mt-5 text-sm text-muted-foreground">
                Loading invitations...
              </p>
            ) : invitations.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                  <Mail className="size-5" />
                </div>

                <h4 className="mt-4 font-semibold">No pending invitations</h4>

                <p className="mt-2 text-sm text-muted-foreground">
                  Create an invite link to add new members to this workspace.
                </p>
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-2xl border">
                <div className="hidden grid-cols-[1.2fr_170px_150px_190px_170px] gap-3 border-b bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">
                  <span>Email</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Expires</span>
                  <span className="text-right">Actions</span>
                </div>

                <div className="divide-y">
                  {invitations.map((invitation) => {
                    const inviteUrl = getInviteUrl(invitation);
                    const canOpenInvitation =
                      invitation.status === "PENDING" && Boolean(inviteUrl);

                    return (
                      <div
                        key={invitation.id}
                        className="grid gap-3 px-4 py-4 lg:grid-cols-[1.2fr_170px_150px_190px_170px] lg:items-center"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {invitation.email}
                          </p>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {invitation.organizationName}
                          </p>
                        </div>

                        <Badge variant="secondary">
                          {roleLabel(invitation.role)}
                        </Badge>

                        <span className="text-sm text-muted-foreground">
                          {statusLabel(invitation.status)}
                        </span>

                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(invitation.expiresAt)}
                        </span>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!canOpenInvitation}
                            onClick={() => {
                              if (!inviteUrl) {
                                return;
                              }

                              window.open(
                                inviteUrl,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            }}
                          >
                            <ExternalLink className="mr-2 size-4" />
                            Open
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!canOpenInvitation}
                            onClick={() =>
                              handleCopyInviteLink(invitation.id, inviteUrl)
                            }
                          >
                            <Copy className="mr-2 size-4" />
                            {copiedInvitationId === invitation.id
                              ? "Copied"
                              : "Copy"}
                          </Button>

                          {canManageMembers ? (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                revokeInvitationMutation.mutate(invitation.id)
                              }
                              disabled={
                                revokeInvitationMutation.isPending ||
                                invitation.status !== "PENDING"
                              }
                            >
                              <XCircle className="size-4 text-red-600" />
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {revokeInvitationMutation.error ? (
              <div className="mt-4">
                <ErrorAlert error={revokeInvitationMutation.error} />
              </div>
            ) : null}
          </>
        )}

        <CreateOrganizationInvitationDialog
          open={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          organizationId={organizationId}
        />
      </CardContent>
    </Card>
  );
}
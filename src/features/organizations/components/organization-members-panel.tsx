"use client";

import { useState } from "react";
import {
  Copy,
  ExternalLink,
  Mail,
  RefreshCw,
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
  useRegenerateOrganizationInvitationLinkMutation,
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

function invitationStatusClassName(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-warning/10 text-warning hover:bg-amber-50";
    case "ACCEPTED":
      return "bg-success/10 text-success hover:bg-emerald-50";
    case "REVOKED":
      return "bg-destructive/10 text-red-700 hover:bg-red-50";
    case "EXPIRED":
      return "bg-muted text-muted-foreground hover:bg-slate-100";
    default:
      return "bg-muted text-muted-foreground hover:bg-slate-100";
  }
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
  const regenerateInvitationMutation =
    useRegenerateOrganizationInvitationLinkMutation(organizationId);

  const [activeTab, setActiveTab] = useState<PanelTab>("members");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [copiedInvitationId, setCopiedInvitationId] = useState<string | null>(
    null,
  );
  const [regeneratedInviteUrls, setRegeneratedInviteUrls] = useState<
    Record<string, string>
  >({});

  const members = membersQuery.data ?? [];
  const invitations = invitationsQuery.data ?? [];

  function handleRegenerateInviteLink(invitationId: string) {
    regenerateInvitationMutation.mutate(invitationId, {
      onSuccess: (response) => {
        const regeneratedUrl =
          response.acceptUrl ??
          (response.invitationToken
            ? `${window.location.origin}/invite/${response.invitationToken}`
            : null);

        if (!regeneratedUrl) {
          return;
        }

        setRegeneratedInviteUrls((current) => ({
          ...current,
          [invitationId]: regeneratedUrl,
        }));
      },
    });
  }

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
    <Card className="compliance-surface overflow-hidden">
      <CardContent className="p-0">
        <div className="border-b bg-background p-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background text-primary">
                <UsersRound className="size-5" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">{t("title")}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {t("description")}
                </p>
              </div>
            </div>

            {canManageMembers ? (
              <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsInviteDialogOpen(true)}
                >
                  <UserPlus className="mr-2 size-4" />
                  Invite member
                </Button>
              </div>
            ) : null}
          </div>

          <div className="mt-6 inline-flex rounded-2xl border bg-muted/30 p-1">
            <Button
              type="button"
              size="sm"
              variant={activeTab === "members" ? "default" : "ghost"}
              className="rounded-xl"
              onClick={() => setActiveTab("members")}
            >
              Members
              <span className="ml-2 rounded-full bg-background shadow-sm px-2 py-0.5 text-xs text-foreground">
                {members.length}
              </span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant={activeTab === "invitations" ? "default" : "ghost"}
              className="rounded-xl"
              onClick={() => setActiveTab("invitations")}
            >
              Invitations
              <span className="ml-2 rounded-full bg-background shadow-sm px-2 py-0.5 text-xs text-foreground">
                {invitations.length}
              </span>
            </Button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "members" ? (
            <>
              {membersQuery.error ? (
                <div className="mb-4">
                  <ErrorAlert error={membersQuery.error} />
                </div>
              ) : null}

              {membersQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">{t("loading")}</p>
              ) : members.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-background text-primary">
                    <UsersRound className="size-5" />
                  </div>

                  <h4 className="mt-4 font-semibold">{t("empty")}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Invite teammates to collaborate in this workspace.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border">
                  <div
                    className={`hidden gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid ${canManageMembers
                      ? "grid-cols-[minmax(260px,1.4fr)_180px_160px_90px]"
                      : "grid-cols-[minmax(260px,1.4fr)_180px_160px]"
                      }`}
                  >
                    <span>{t("columns.member")}</span>
                    <span>{t("columns.role")}</span>
                    <span>{t("columns.status")}</span>
                    {canManageMembers ? (
                      <span className="text-right">{t("columns.actions")}</span>
                    ) : null}
                  </div>

                  <div className="divide-y">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className={`grid gap-4 px-4 py-4 lg:items-center ${canManageMembers
                          ? "lg:grid-cols-[minmax(260px,1.4fr)_180px_160px_90px]"
                          : "lg:grid-cols-[minmax(260px,1.4fr)_180px_160px]"
                          }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-semibold">
                              {member.fullName}
                            </p>

                            {member.role === "OWNER" ? (
                              <ShieldCheck className="size-4 shrink-0 text-primary" />
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

                        {canManageMembers ? (
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteMutation.mutate(member.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        ) : null}
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
                <div className="mb-4">
                  <ErrorAlert error={invitationsQuery.error} />
                </div>
              ) : null}

              {invitationsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading invitations...
                </p>
              ) : invitations.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-background text-primary">
                    <Mail className="size-5" />
                  </div>

                  <h4 className="mt-4 font-semibold">No invitations yet</h4>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Create an invite link to add new members to this workspace.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invitations.map((invitation) => {
                    const inviteUrl =
                      regeneratedInviteUrls[invitation.id] ??
                      getInviteUrl(invitation);

                    const canOpenInvitation =
                      invitation.status === "PENDING" && Boolean(inviteUrl);

                    return (
                      <div
                        key={invitation.id}
                        className="rounded-2xl border bg-background p-4 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-semibold">
                                {invitation.email}
                              </p>

                              <Badge variant="secondary">
                                {roleLabel(invitation.role)}
                              </Badge>

                              <Badge
                                variant="secondary"
                                className={invitationStatusClassName(
                                  invitation.status,
                                )}
                              >
                                {statusLabel(invitation.status)}
                              </Badge>
                            </div>

                            <div className="mt-2 grid gap-1 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-3">
                              <p className="truncate">
                                Workspace: {invitation.organizationName}
                              </p>
                              <p>
                                Expires: {formatDateTime(invitation.expiresAt)}
                              </p>
                              <p>
                                Invited by:{" "}
                                {invitation.invitedByEmail ?? "Unknown"}
                              </p>
                            </div>

                            {canOpenInvitation ? (
                              <div className="mt-3 rounded-xl bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                                <span className="font-medium text-slate-700">
                                  Invite link ready.
                                </span>{" "}
                                You can open or copy this regenerated link.
                              </div>
                            ) : invitation.status === "PENDING" ? (
                              <div className="mt-3 rounded-xl bg-warning/10 px-3 py-2 text-xs text-warning">
                                This invite does not expose its original link.
                                Regenerate a secure link to open or copy it.
                              </div>
                            ) : (
                              <div className="mt-3 rounded-xl bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                                This invitation is no longer pending.
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap justify-end gap-2 xl:min-w-[360px]">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={
                                regenerateInvitationMutation.isPending ||
                                invitation.status !== "PENDING"
                              }
                              onClick={() =>
                                handleRegenerateInviteLink(invitation.id)
                              }
                            >
                              <RefreshCw className="mr-2 size-4" />
                              Regenerate
                            </Button>

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
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-red-50 hover:text-red-700"
                                onClick={() =>
                                  revokeInvitationMutation.mutate(invitation.id)
                                }
                                disabled={
                                  revokeInvitationMutation.isPending ||
                                  invitation.status !== "PENDING"
                                }
                              >
                                <XCircle className="mr-2 size-4" />
                                Revoke
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {revokeInvitationMutation.error ||
                regenerateInvitationMutation.error ? (
                <div className="mt-4">
                  <ErrorAlert
                    error={
                      revokeInvitationMutation.error ??
                      regenerateInvitationMutation.error
                    }
                  />
                </div>
              ) : null}
            </>
          )}
        </div>

        <CreateOrganizationInvitationDialog
          open={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          organizationId={organizationId}
        />
      </CardContent>
    </Card>
  );
}

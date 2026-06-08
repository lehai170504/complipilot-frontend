"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CreditCard,
  Loader2,
  Save,
  Settings,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisableWorkspaceDialog } from "@/features/organizations/components/disable-workspace-dialog";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import {
  useOrganizationSettingsQuery,
  useUpdateOrganizationSettingsMutation,
} from "@/features/organizations/hooks/organization-settings-hooks";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusTone(status: string) {
  if (status === "ACTIVE") {
    return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
  }

  return "bg-red-50 text-red-700 hover:bg-red-50";
}

export default function SettingsPage() {
  const { activeOrganization, canManageMembers } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const settingsQuery = useOrganizationSettingsQuery(organizationId);
  const updateSettingsMutation =
    useUpdateOrganizationSettingsMutation(organizationId);

  const [draftName, setDraftName] = useState<string | undefined>(undefined);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);

  const settings = settingsQuery.data;
  const canManageWorkspace = canManageMembers;
  const isDisabled = settings?.status === "DISABLED";

  const name = draftName ?? settings?.name ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!organizationId || !name.trim() || isDisabled) {
      return;
    }

    updateSettingsMutation.mutate(
      {
        name: name.trim(),
      },
      {
        onSuccess: () => {
          setDraftName(undefined);
        },
      },
    );
  }

  const hasNameChanged = Boolean(
    settings && draftName !== undefined && name.trim() !== settings.name,
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div className="relative">
          <div className="absolute -right-20 -top-20 size-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Workspace settings
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
                Manage your workspace profile and controls
              </h2>

              <p className="mt-3 max-w-2xl text-slate-300">
                Update workspace identity, review status metadata, and jump to
                member or billing management.
              </p>
            </div>

            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
              <Settings className="size-6" />
            </div>
          </div>
        </div>
      </section>

      {settingsQuery.error ? <ErrorAlert error={settingsQuery.error} /> : null}

      {isDisabled ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">Workspace is disabled</p>
              <p className="mt-1 text-sm leading-6">
                This workspace is disabled. Some operations may be restricted.
                Contact a platform admin if this was a mistake.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {settingsQuery.isLoading ? (
        <Card>
          <CardContent className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading workspace settings...
          </CardContent>
        </Card>
      ) : settings ? (
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                    <Building2 className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Workspace profile</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Rename the workspace shown across CompliPilot.
                    </p>
                  </div>
                </div>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name">Workspace name</Label>
                    <Input
                      id="workspace-name"
                      value={name}
                      onChange={(event) => setDraftName(event.target.value)}
                      disabled={!canManageWorkspace || isDisabled}
                      placeholder="Workspace name"
                    />

                    {!canManageWorkspace ? (
                      <p className="text-xs text-muted-foreground">
                        You need manager permissions to rename this workspace.
                      </p>
                    ) : null}

                    {isDisabled ? (
                      <p className="text-xs text-red-700">
                        Disabled workspaces cannot be renamed.
                      </p>
                    ) : null}
                  </div>

                  {updateSettingsMutation.error ? (
                    <ErrorAlert error={updateSettingsMutation.error} />
                  ) : null}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={
                        !canManageWorkspace ||
                        isDisabled ||
                        !hasNameChanged ||
                        !name.trim() ||
                        updateSettingsMutation.isPending
                      }
                    >
                      {updateSettingsMutation.isPending ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 size-4" />
                      )}
                      Save changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                    <ShieldCheck className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      Workspace metadata
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Read-only system details for this workspace.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Slug
                    </p>
                    <p className="mt-2 font-semibold">/{settings.slug}</p>
                  </div>

                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Status
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant="secondary"
                        className={statusTone(settings.status)}
                      >
                        {settings.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Created
                    </p>
                    <p className="mt-2 font-semibold">
                      {formatDateTime(settings.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Updated
                    </p>
                    <p className="mt-2 font-semibold">
                      {formatDateTime(settings.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Quick actions</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Jump to related workspace management pages.
                </p>

                <div className="mt-5 space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto w-full justify-between rounded-2xl p-4"
                  >
                    <Link href="/workspaces">
                      <span className="flex items-center gap-3">
                        <UsersRound className="size-5 text-cyan-700" />
                        <span className="text-left">
                          <span className="block font-semibold">
                            Members & invitations
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            Manage workspace members and invite links.
                          </span>
                        </span>
                      </span>

                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-auto w-full justify-between rounded-2xl p-4"
                  >
                    <Link href="/billing">
                      <span className="flex items-center gap-3">
                        <CreditCard className="size-5 text-cyan-700" />
                        <span className="text-left">
                          <span className="block font-semibold">
                            Billing & usage
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            Review plan limits and usage quotas.
                          </span>
                        </span>
                      </span>

                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                    <AlertTriangle className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-900">
                      Danger zone
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-red-700">
                      Disable this workspace without deleting its data. This
                      action is limited to owners and will be recorded in the
                      audit trail.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  className="mt-5 w-full"
                  disabled={
                    !canManageWorkspace || isDisabled || !organizationId
                  }
                  onClick={() => setIsDisableDialogOpen(true)}
                >
                  Disable workspace
                </Button>

                {!canManageWorkspace ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    You need owner/admin permissions to access danger-zone
                    actions.
                  </p>
                ) : null}

                {isDisabled ? (
                  <p className="mt-2 text-xs text-red-700">
                    This workspace has already been disabled.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </section>
      ) : null}

      <DisableWorkspaceDialog
        open={isDisableDialogOpen}
        onOpenChange={setIsDisableDialogOpen}
        organizationId={organizationId}
        workspaceName={settings?.name ?? "this workspace"}
      />
    </div>
  );
}

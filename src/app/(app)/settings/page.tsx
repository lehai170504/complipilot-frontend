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
    return "bg-success/10 text-success hover:bg-success/20";
  }

  return "bg-destructive/10 text-destructive hover:bg-destructive/20";
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
      <section className="compliance-hero">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              Workspace settings
            </p>

            <h2 className="mt-4 max-w-3xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
              Manage your workspace profile and controls
            </h2>

            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Update workspace identity, review status metadata, and jump to
              member or billing management.
            </p>
          </div>

          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Settings className="size-6" />
          </div>
        </div>
      </section>

      {settingsQuery.error ? <ErrorAlert error={settingsQuery.error} /> : null}

      {isDisabled ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-5 text-destructive">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">Workspace is disabled</p>
              <p className="mt-1 text-sm leading-6 opacity-90">
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
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
                      <p className="text-xs text-destructive">
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
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
                  <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Slug
                    </p>
                    <p className="mt-2 font-semibold">/{settings.slug}</p>
                  </div>

                  <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
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

                  <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Created
                    </p>
                    <p className="mt-2 font-semibold text-foreground">
                      {formatDateTime(settings.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Updated
                    </p>
                    <p className="mt-2 font-semibold text-foreground">
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
                    className="h-auto w-full justify-between rounded-2xl p-4 transition-colors hover:bg-muted/50"
                  >
                    <Link href="/workspaces">
                      <span className="flex items-center gap-3">
                        <UsersRound className="size-5 text-primary" />
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
                    className="h-auto w-full justify-between rounded-2xl p-4 transition-colors hover:bg-muted/50"
                  >
                    <Link href="/billing">
                      <span className="flex items-center gap-3">
                        <CreditCard className="size-5 text-primary" />
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

            <Card className="border-destructive/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-destructive">
                      Danger zone
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-destructive/80">
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
                  <p className="mt-2 text-xs text-destructive">
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

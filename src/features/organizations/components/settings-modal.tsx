"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CreditCard,
  Loader2,
  Save,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export function SettingsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const tModal = useTranslations("settingsModal");
  const tStatus = useTranslations("status");
  const { activeOrganization, canManageMembers, canDisableWorkspace } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const settingsQuery = useOrganizationSettingsQuery(organizationId);
  const updateSettingsMutation = useUpdateOrganizationSettingsMutation(organizationId);

  const [draftName, setDraftName] = useState<string | undefined>(undefined);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);

  const settings = settingsQuery.data;
  const canManageWorkspace = canManageMembers;
  const isDisabled = settings?.status === "DISABLED";

  useEffect(() => {
    if (settings && draftName === undefined) {
      setDraftName(settings.name);
    }
  }, [settings, draftName]);

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
          // Success
        },
      },
    );
  }

  const hasNameChanged = Boolean(
    settings && draftName !== undefined && name.trim() !== settings.name,
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-background">
          <DialogHeader className="p-6 pb-2 border-b bg-background">
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Building2 className="size-6 text-primary" />
              {tModal("title")}
            </DialogTitle>
            <DialogDescription>
              {tModal("description")}
            </DialogDescription>
          </DialogHeader>

          <div className="p-5 overflow-y-auto max-h-[85vh] space-y-5 bg-muted/30">
            {settingsQuery.error ? <ErrorAlert error={settingsQuery.error} /> : null}

            {isDisabled ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-5 text-destructive">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0" />
                  <div>
                    <p className="font-semibold">{tModal("disabledAlert.title")}</p>
                    <p className="mt-1 text-sm leading-6 opacity-90">
                      {tModal("disabledAlert.description")}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {settingsQuery.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-8 justify-center bg-card rounded-2xl border border-border/50 shadow-sm">
                <Loader2 className="size-4 animate-spin" />
                {tModal("loading")}
              </div>
            ) : settings ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-5">
                  <Card className="shadow-sm border-border/50">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Building2 className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{tModal("profile.title")}</p>
                          <p className="text-sm text-muted-foreground mt-1 leading-snug">
                            {tModal("profile.description")}
                          </p>
                        </div>
                      </div>

                      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                          <Label htmlFor="workspace-name">{tModal("profile.name")}</Label>
                          <Input
                            id="workspace-name"
                            value={name}
                            onChange={(event) => setDraftName(event.target.value)}
                            disabled={!canManageWorkspace || isDisabled}
                            placeholder="Workspace name"
                          />

                          {!canManageWorkspace ? (
                            <p className="text-[11px] text-muted-foreground">
                              You need manager permissions to rename this workspace.
                            </p>
                          ) : null}

                          {isDisabled ? (
                            <p className="text-[11px] text-destructive">
                              Disabled workspaces cannot be renamed.
                            </p>
                          ) : null}
                        </div>

                        {updateSettingsMutation.error ? (
                          <ErrorAlert error={updateSettingsMutation.error} />
                        ) : null}

                        <div className="flex justify-end pt-2">
                          <Button
                            type="submit"
                            size="sm"
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
                            {tModal("profile.save")}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-border/50">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                          <ShieldCheck className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{tModal("metadata.title")}</p>
                          <p className="text-sm text-muted-foreground mt-1 leading-snug">
                            {tModal("metadata.description")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Slug
                          </p>
                          <p className="mt-1.5 font-semibold text-sm">/{settings.slug}</p>
                        </div>

                        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            STATUS
                          </p>
                          <div className="mt-1.5">
                            <Badge variant="secondary" className={statusTone(settings.status)}>
                              {tStatus(settings.status)}
                            </Badge>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {tModal("metadata.created")}
                          </p>
                          <p className="mt-1.5 text-sm font-semibold text-foreground">
                            {formatDateTime(settings.createdAt)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {tModal("metadata.updated")}
                          </p>
                          <p className="mt-1.5 text-sm font-semibold text-foreground">
                            {formatDateTime(settings.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="shadow-sm border-border/50">
                    <CardContent className="p-5 sm:p-6">
                      <p className="font-semibold">{tModal("quickActions.title")}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-snug">
                        {tModal("quickActions.description")}
                      </p>

                      <div className="mt-4 space-y-2">
                        <Button
                          asChild
                          variant="outline"
                          className="h-auto w-full justify-between rounded-xl p-3 transition-colors hover:bg-muted/50"
                        >
                          <Link href="/workspaces">
                            <span className="flex items-center gap-3">
                              <UsersRound className="size-4 text-primary" />
                              <span className="text-left">
                                <span className="block text-sm font-semibold">
                                  {tModal("quickActions.members")}
                                </span>
                              </span>
                            </span>
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>

                        <Button
                          asChild
                          variant="outline"
                          className="h-auto w-full justify-between rounded-xl p-3 transition-colors hover:bg-muted/50"
                          onClick={() => {
                            // If they click this, we should close the modal ideally. 
                            // We can just let the navigation handle it.
                            onOpenChange(false);
                          }}
                        >
                          <Link href="/billing">
                            <span className="flex items-center gap-3">
                              <CreditCard className="size-4 text-primary" />
                              <span className="text-left">
                                <span className="block text-sm font-semibold">
                                  {tModal("quickActions.billing")}
                                </span>
                              </span>
                            </span>
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-destructive/20 bg-destructive/5">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                          <AlertTriangle className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-destructive">{tModal("dangerZone.title")}</p>
                          <p className="text-sm leading-relaxed text-destructive/80 mt-1.5">
                            {tModal("dangerZone.description")}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="mt-4 w-full"
                        disabled={!canDisableWorkspace || isDisabled || !organizationId}
                        onClick={() => setIsDisableDialogOpen(true)}
                      >
                        {tModal("dangerZone.disable")}
                      </Button>

                      {!canDisableWorkspace ? (
                        <p className="mt-2 text-[10px] text-muted-foreground text-center">
                          Requires owner permissions.
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <DisableWorkspaceDialog
        open={isDisableDialogOpen}
        onOpenChange={setIsDisableDialogOpen}
        organizationId={organizationId}
        workspaceName={settings?.name ?? "this workspace"}
      />
    </>
  );
}

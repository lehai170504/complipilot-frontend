"use client";

import { FormEvent, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  CalendarClock,
  Loader2,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useUpdateUserProfileMutation,
  useUserProfileQuery,
} from "@/features/profile/hooks/profile-hooks";
import { ChangePasswordDialog } from "@/features/profile/components/change-password-dialog";

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

export function ProfileModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const tModal = useTranslations("profileModal");
  const tStatus = useTranslations("status");
  const profileQuery = useUserProfileQuery();
  const updateProfileMutation = useUpdateUserProfileMutation();
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);

  const profile = profileQuery.data;

  const [draftFullName, setDraftFullName] = useState<string | undefined>(undefined);

  // Sync draft full name when profile loads
  useEffect(() => {
    if (profile && draftFullName === undefined) {
      setDraftFullName(profile.fullName);
    }
  }, [profile, draftFullName]);

  const fullName = draftFullName ?? profile?.fullName ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim()) {
      return;
    }

    updateProfileMutation.mutate(
      {
        fullName: fullName.trim(),
      },
      {
        onSuccess: () => {
          // Keep the modal open so they see success, or close it? We leave it open.
        },
      },
    );
  }

  const hasFullNameChanged = Boolean(
    profile &&
    draftFullName !== undefined &&
    fullName.trim() !== profile.fullName,
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-background">
          <DialogHeader className="p-6 pb-2 border-b bg-background">
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <UserCircle className="size-6 text-primary" />
              {tModal("title")}
            </DialogTitle>
            <DialogDescription>
              {tModal("description")}
            </DialogDescription>
          </DialogHeader>

          <div className="p-5 overflow-y-auto max-h-[85vh] space-y-5 bg-muted/30">
            {profileQuery.error ? <ErrorAlert error={profileQuery.error} /> : null}

            {profileQuery.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-8 justify-center bg-card rounded-2xl border border-border/50 shadow-sm">
                <Loader2 className="size-4 animate-spin" />
                Loading profile...
              </div>
            ) : profile ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-5">
                  <Card className="shadow-sm border-border/50">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <UserCircle className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{tModal("details.title")}</p>
                          <p className="text-sm text-muted-foreground mt-1 leading-snug">
                            {tModal("details.description")}
                          </p>
                        </div>
                      </div>

                      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                          <Label htmlFor="fullName">{tModal("details.fullName")}</Label>
                          <Input
                            id="full-name"
                            value={fullName}
                            onChange={(event) => setDraftFullName(event.target.value)}
                            placeholder="Your full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">{tModal("details.email")}</Label>
                          <Input
                            id="email"
                            className="bg-muted/50 border-border/50 text-muted-foreground font-medium"
                            disabled
                            type="email"
                            value={profile.email}
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            {tModal("details.emailHelp")}
                          </p>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Button
                            className="w-full sm:w-auto font-semibold"
                            disabled={!hasFullNameChanged || !fullName.trim() || updateProfileMutation.isPending}
                            type="submit"
                          >
                            {updateProfileMutation.isPending ? (
                              <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 size-4" />
                            )}
                            {tModal("details.save")}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-border/50">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                          <CalendarClock className="size-5" />
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
                            {tModal("metadata.userId")}
                          </p>
                          <p className="mt-1.5 font-mono text-sm font-semibold truncate" title={profile.id}>
                            {profile.id}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {tModal("metadata.status")}
                          </p>
                          <div className="mt-1.5">
                            <Badge
                              variant="secondary"
                              className={statusTone(profile.status)}
                            >
                              {tStatus(profile.status)}
                            </Badge>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {tModal("metadata.created")}
                          </p>
                          <p className="mt-1.5 text-sm font-semibold">
                            {formatDateTime(profile.createdAt)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {tModal("metadata.updated")}
                          </p>
                          <p className="mt-1.5 text-sm font-semibold">
                            {formatDateTime(profile.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="shadow-sm border-border/50">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                          <Mail className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{tModal("identity.title")}</p>
                          <p className="text-sm text-muted-foreground mt-1 leading-snug">
                            {tModal("identity.description")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-border/50 bg-background px-4 py-3 flex items-center justify-center">
                        <span className="font-semibold text-foreground tracking-wide">{profile.email}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-border/50">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                          <LockKeyhole className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{tModal("security.title")}</p>
                          <p className="text-sm text-muted-foreground mt-1 leading-snug">
                            {tModal("security.description")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <Button
                          onClick={() => setIsChangePasswordDialogOpen(true)}
                          variant="secondary"
                          className="w-full font-semibold bg-foreground text-background hover:bg-foreground/90"
                        >
                          {tModal("security.changePassword")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-info/20 bg-info/5">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-info/10 text-info">
                          <ShieldCheck className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-info">{tModal("audit.title")}</p>
                          <p className="text-sm text-info/80 mt-1.5 leading-relaxed">
                            {tModal("audit.description")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      />
    </>
  );
}

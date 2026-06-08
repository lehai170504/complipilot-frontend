"use client";

import { FormEvent, useState } from "react";
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
    return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
  }

  return "bg-red-50 text-red-700 hover:bg-red-50";
}

export default function ProfilePage() {
  const profileQuery = useUserProfileQuery();
  const updateProfileMutation = useUpdateUserProfileMutation();
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);

  const profile = profileQuery.data;

  const [draftFullName, setDraftFullName] = useState<string | undefined>(
    undefined,
  );

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
          setDraftFullName(undefined);
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
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div className="relative">
          <div className="absolute -right-20 -top-20 size-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Account profile
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
                Manage your personal account details
              </h2>

              <p className="mt-3 max-w-2xl text-slate-300">
                Update your name, review account status, and prepare security
                settings for future password management.
              </p>
            </div>

            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
              <UserCircle className="size-6" />
            </div>
          </div>
        </div>
      </section>

      {profileQuery.error ? <ErrorAlert error={profileQuery.error} /> : null}

      {profileQuery.isLoading ? (
        <Card>
          <CardContent className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading profile...
          </CardContent>
        </Card>
      ) : profile ? (
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                    <UserCircle className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Profile details</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Update the name shown across your workspace activity.
                    </p>
                  </div>
                </div>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full name</Label>
                    <Input
                      id="full-name"
                      value={fullName}
                      onChange={(event) => setDraftFullName(event.target.value)}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email} disabled />
                    <p className="text-xs text-muted-foreground">
                      Email changes are not supported yet.
                    </p>
                  </div>

                  {updateProfileMutation.error ? (
                    <ErrorAlert error={updateProfileMutation.error} />
                  ) : null}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={
                        !hasFullNameChanged ||
                        !fullName.trim() ||
                        updateProfileMutation.isPending
                      }
                    >
                      {updateProfileMutation.isPending ? (
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
                    <CalendarClock className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Account metadata</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Read-only account details.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      User ID
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold">
                      {profile.id}
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Status
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant="secondary"
                        className={statusTone(profile.status)}
                      >
                        {profile.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Created
                    </p>
                    <p className="mt-2 font-semibold">
                      {formatDateTime(profile.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Updated
                    </p>
                    <p className="mt-2 font-semibold">
                      {formatDateTime(profile.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                    <Mail className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Login identity</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Your email is used for login, invitations, audit
                      attribution, and notification delivery.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-2 break-all font-semibold">
                    {profile.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                    <LockKeyhole className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Security</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Password change and session management will be added in a
                      later security settings step.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  className="mt-5 w-full"
                  onClick={() => setIsChangePasswordDialogOpen(true)}
                >
                  Change password
                </Button>
              </CardContent>
            </Card>

            <Card className="border-cyan-200 bg-cyan-50/60">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                    <ShieldCheck className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Audit attribution</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      Actions you perform are recorded using your account email
                      so audit logs remain traceable and reviewer-friendly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : null}

      <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      />
    </div>
  );
}

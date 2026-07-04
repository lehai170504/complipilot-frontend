"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAcceptOrganizationInvitationMutation,
  useOrganizationInvitationByTokenQuery,
} from "@/features/organizations/hooks/organization-invitation-hooks";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth-hooks";

function roleLabel(role: string) {
  return role
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

export default function AcceptInvitationPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();

  const token = params.token;

  const invitationQuery = useOrganizationInvitationByTokenQuery(token);
  const acceptMutation = useAcceptOrganizationInvitationMutation(token);
  const { data: currentUser } = useCurrentUserQuery();

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const invitation = invitationQuery.data;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!invitation) {
      return;
    }

    const isCurrentUserMatched =
      currentUser?.email.toLowerCase() === invitation.email.toLowerCase();

    acceptMutation.mutate(
      {
        email: invitation.email,
        ...(isCurrentUserMatched
          ? {}
          : { fullName: fullName.trim(), password }),
      },
      {
        onSuccess: () => {
          if (isCurrentUserMatched) {
            router.push("/dashboard?invitationAccepted=true");
          } else {
            router.push("/login?invitationAccepted=true");
          }
        },
      },
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,var(--color-primary)_0%,transparent_40%)] opacity-10 pointer-events-none" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl items-center justify-center z-10">
        <Card className="compliance-surface w-full shadow-2xl shadow-primary/5">
          <CardContent className="p-6 sm:p-8">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner shadow-primary/20">
              <Mail className="size-5" />
            </div>

            <div className="mt-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Accept workspace invitation
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Create your account and join the invited workspace.
              </p>
            </div>

            {invitationQuery.isLoading ? (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Loading invitation...
              </p>
            ) : invitationQuery.error ? (
              <div className="mt-8">
                <ErrorAlert error={invitationQuery.error} />

                <div className="mt-5 text-center">
                  <Button asChild variant="outline">
                    <Link href="/login">Back to login</Link>
                  </Button>
                </div>
              </div>
            ) : invitation ? (
              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ShieldCheck className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold">
                        {invitation.organizationName}
                      </p>
                      <p className="mt-1 break-words text-sm text-muted-foreground">
                        Invited email: {invitation.email}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Role: {roleLabel(invitation.role)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Expires at: {formatDateTime(invitation.expiresAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {acceptMutation.isSuccess ? (
                  <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-sm text-success">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                      <div>
                        <p className="font-semibold">Invitation accepted</p>
                        <p className="mt-1">
                          Redirecting you to the dashboard...
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {currentUser?.email.toLowerCase() === invitation.email.toLowerCase() ? (
                      <div className="rounded-xl bg-primary/5 p-4 text-sm text-primary">
                        You are already logged in as <strong>{currentUser.email}</strong>. You can accept this invitation directly.
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="full-name">Full name</Label>
                          <Input
                            id="full-name"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="At least 8 characters"
                            minLength={8}
                            required
                          />
                        </div>
                      </>
                    )}

                    {acceptMutation.error ? (
                      <ErrorAlert error={acceptMutation.error} />
                    ) : null}

                    <Button
                      className="w-full"
                      type="submit"
                      disabled={
                        acceptMutation.isPending ||
                        (currentUser?.email.toLowerCase() !== invitation.email.toLowerCase() && (!fullName.trim() || password.length < 8))
                      }
                    >
                      {acceptMutation.isPending
                        ? "Accepting invitation..."
                        : "Accept invitation"}
                    </Button>

                    {currentUser?.email.toLowerCase() !== invitation.email.toLowerCase() ? (
                      <p className="text-center text-xs text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                          className="font-medium text-primary hover:text-primary/80 transition-colors"
                          href="/login"
                        >
                          Sign in instead
                        </Link>
                      </p>
                    ) : null}
                  </form>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

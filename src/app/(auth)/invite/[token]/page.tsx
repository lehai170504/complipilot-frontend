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

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const invitation = invitationQuery.data;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!invitation) {
      return;
    }

    acceptMutation.mutate(
      {
        email: invitation.email,
        fullName: fullName.trim(),
        password,
      },
      {
        onSuccess: () => {
          router.push("/login?invitationAccepted=true");
        },
      },
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl items-center justify-center">
        <Card className="w-full border-cyan-200/40 shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
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
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
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
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                      <div>
                        <p className="font-semibold">Invitation accepted</p>
                        <p className="mt-1">
                          Redirecting you to the login page...
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
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

                    {acceptMutation.error ? (
                      <ErrorAlert error={acceptMutation.error} />
                    ) : null}

                    <Button
                      className="w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                      type="submit"
                      disabled={
                        acceptMutation.isPending ||
                        !fullName.trim() ||
                        password.length < 8
                      }
                    >
                      {acceptMutation.isPending
                        ? "Accepting invitation..."
                        : "Accept invitation"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        className="font-medium text-cyan-700 hover:text-cyan-800"
                        href="/login"
                      >
                        Sign in instead
                      </Link>
                    </p>
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

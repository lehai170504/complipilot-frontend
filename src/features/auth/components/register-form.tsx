"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_REGISTER_DATA } from "@/features/auth/constants";
import { useRegisterMutation } from "@/features/auth/hooks/auth-hooks";

export function RegisterForm() {
  const registerMutation = useRegisterMutation();

  const [fullName, setFullName] = useState(DEMO_REGISTER_DATA.fullName);
  const [organizationName, setOrganizationName] = useState(DEMO_REGISTER_DATA.organizationName);
  const [email, setEmail] = useState(DEMO_REGISTER_DATA.email);
  const [password, setPassword] = useState(DEMO_REGISTER_DATA.password);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    registerMutation.mutate({
      fullName,
      organizationName,
      email,
      password,
    });
  }

  return (
    <Card className="border-white/10 bg-white text-slate-950 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl">Create account</CardTitle>
        <CardDescription>
          Start a workspace with OWNER access.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization</Label>
            <Input
              id="organizationName"
              value={organizationName}
              onChange={(event) => setOrganizationName(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              autoComplete="new-password"
              minLength={8}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {registerMutation.error ? <ErrorAlert error={registerMutation.error} /> : null}

          <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-cyan-700 hover:text-cyan-800" href="/login">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
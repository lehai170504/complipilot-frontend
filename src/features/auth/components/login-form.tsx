"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_LOGIN_DATA } from "@/features/auth/constants";
import { useLoginMutation } from "@/features/auth/hooks/auth-hooks";

export function LoginForm() {
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState(DEMO_LOGIN_DATA.email);
  const [password, setPassword] = useState(DEMO_LOGIN_DATA.password);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  }

  return (
    <Card className="border-white/10 bg-white text-slate-950 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl">Sign in</CardTitle>
        <CardDescription>
          Continue to your compliance workspace.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {loginMutation.error ? <ErrorAlert error={loginMutation.error} /> : null}

          <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          No account yet?{" "}
          <Link className="font-semibold text-cyan-700 hover:text-cyan-800" href="/register">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_LOGIN_DATA } from "@/features/auth/constants";
import { useLoginMutation } from "@/features/auth/hooks/auth-hooks";
import { loginSchema, type LoginFormData } from "@/lib/validation-schemas";

export function LoginForm() {
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: DEMO_LOGIN_DATA.email,
      password: DEMO_LOGIN_DATA.password,
    },
  });

  function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data);
  }

  return (
    <Card className="border-white/10 bg-white text-slate-950 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl">Sign in</CardTitle>
        <CardDescription>Continue to your compliance workspace.</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="email"
              type="email"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              autoComplete="current-password"
              type="password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            ) : null}
          </div>

          {loginMutation.error ? <ErrorAlert error={loginMutation.error} /> : null}

          <Button className="w-full" type="submit" disabled={isSubmitting || loginMutation.isPending}>
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
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_REGISTER_DATA } from "@/features/auth/constants";
import { useRegisterMutation } from "@/features/auth/hooks/auth-hooks";
import { registerSchema, type RegisterFormData } from "@/lib/validation-schemas";

export function RegisterForm() {
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: DEMO_REGISTER_DATA.fullName,
      organizationName: DEMO_REGISTER_DATA.organizationName,
      email: DEMO_REGISTER_DATA.email,
      password: DEMO_REGISTER_DATA.password,
    },
  });

  function onSubmit(data: RegisterFormData) {
    registerMutation.mutate(data);
  }

  return (
    <Card className="border-white/10 bg-white text-slate-950 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl">Create account</CardTitle>
        <CardDescription>Start a workspace with OWNER access.</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" autoComplete="name" {...register("fullName")} />
            {errors.fullName ? <p className="text-sm text-red-600">{errors.fullName.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization</Label>
            <Input id="organizationName" {...register("organizationName")} />
            {errors.organizationName ? <p className="text-sm text-red-600">{errors.organizationName.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" autoComplete="email" type="email" {...register("email")} />
            {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" autoComplete="new-password" type="password" {...register("password")} />
            {errors.password ? <p className="text-sm text-red-600">{errors.password.message}</p> : null}
          </div>

          {registerMutation.error ? <ErrorAlert error={registerMutation.error} /> : null}

          <Button className="w-full" type="submit" disabled={isSubmitting || registerMutation.isPending}>
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
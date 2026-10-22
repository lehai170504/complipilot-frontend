"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_REGISTER_DATA } from "@/features/auth/constants";
import { useRegisterMutation } from "@/features/auth/hooks/auth-hooks";
import { toastFirstValidationError } from "@/lib/forms/toast-first-validation-error";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validation-schemas";

export function RegisterForm() {
  const t = useTranslations("register");
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
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
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors self-start group"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Back to landing page
      </Link>
      <Card className="compliance-surface border-border/50 shadow-2xl shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-3xl text-foreground">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit, toastFirstValidationError)}
        >
          <div className="space-y-2">
            <Label htmlFor="fullName">{t("fullName")}</Label>
            <Input
              id="fullName"
              autoComplete="name"
              {...register("fullName")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationName">{t("organization")}</Label>
            <Input id="organizationName" {...register("organizationName")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              autoComplete="email"
              type="email"
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              autoComplete="new-password"
              type="password"
              {...register("password")}
            />
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={isSubmitting || registerMutation.isPending}
          >
            {registerMutation.isPending ? t("submitting") : t("submit")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <Link
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
            href="/login"
          >
            {t("signIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
    </div>
  );
}

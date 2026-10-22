"use client";

import { useTranslations } from "next-intl";

import { BrandMark } from "@/components/brand/brand-mark";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("authShell");

  const features = [
    t("features.evidence"),
    t("features.tasks"),
    t("features.support"),
  ];

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="mx-auto grid min-h-dvh w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1fr_440px] lg:items-center lg:gap-12">
        <section className="hidden lg:block">
          <BrandMark />

          <div className="mt-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-foreground xl:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div className="mt-10 grid max-w-2xl gap-4">
            {features.map((item) => (
              <div
                className="compliance-surface rounded-xl p-4 text-muted-foreground"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="z-10 w-full max-w-md justify-self-center lg:max-w-none">{children}</section>
      </div>
    </main>
  );
}

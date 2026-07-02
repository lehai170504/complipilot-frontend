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
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--color-primary)_0%,transparent_30%)] opacity-10 pointer-events-none" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1fr_440px] lg:items-center">
        <section className="hidden lg:block animate-in fade-in slide-in-from-left-8 duration-1000">
          <BrandMark />

          <div className="mt-16 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight text-foreground">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div className="mt-10 grid max-w-2xl gap-4">
            {features.map((item) => (
              <div
                className="compliance-glass rounded-3xl p-5 text-muted-foreground transition-all duration-300 hover:text-foreground hover:shadow-primary/10 hover:-translate-y-1"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-right-8 duration-1000 z-10">{children}</section>
      </div>
    </main>
  );
}

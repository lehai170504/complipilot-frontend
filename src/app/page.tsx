import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Languages,
  ListChecks,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";

const highlightItems = [
  {
    key: "controls",
    icon: ClipboardCheck,
  },
  {
    key: "evidence",
    icon: FileCheck2,
  },
  {
    key: "tasks",
    icon: ListChecks,
  },
  {
    key: "audit",
    icon: ScrollText,
  },
  {
    key: "frameworks",
    icon: BookOpen,
  },
] as const;

const workflowItems = [
  {
    key: "framework",
    icon: BookOpen,
  },
  {
    key: "control",
    icon: ClipboardCheck,
  },
  {
    key: "evidence",
    icon: FileCheck2,
  },
  {
    key: "audit",
    icon: ScrollText,
  },
] as const;

const moduleItems = [
  "auth",
  "dashboard",
  "evidence",
  "tasks",
  "audit",
  "i18n",
] as const;

export default async function HomePage() {
  const t = await getTranslations("landing");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_36%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_30%),linear-gradient(180deg,#020617_0%,#020617_48%,#0f172a_100%)]" />
        <div className="absolute inset-0 compliance-grid-bg opacity-30" />
        <div className="absolute left-1/2 top-28 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-8">
          <header className="flex items-center justify-between gap-4">
            <Link className="flex items-center gap-3" href="/">
              <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400/20 to-cyan-600/20 text-cyan-300 ring-1 ring-cyan-300/20">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-base font-bold tracking-tight">
                  CompliPilot
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                  {t("brandSubtitle")}
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
              <a className="hover:text-white" href="#features">
                {t("nav.features")}
              </a>
              <a className="hover:text-white" href="#workflow">
                {t("nav.workflow")}
              </a>
              <a className="hover:text-white" href="#modules">
                {t("nav.modules")}
              </a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />

              <Button
                asChild
                variant="ghost"
                className="hidden text-white hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                <Link href="/login">{t("nav.signIn")}</Link>
              </Button>

              <Button
                asChild
                className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              >
                <Link href="/register">{t("nav.createAccount")}</Link>
              </Button>
            </div>
          </header>

          <div className="grid items-center gap-12 py-20 lg:grid-cols-[1fr_0.9fr] lg:py-28">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-200">
                <Sparkles className="size-4" />
                {t("hero.eyebrow")}
              </div>

              <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {t("hero.description")}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                >
                  <Link href="/register">
                    {t("hero.primaryCta")}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/login">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>

              <div className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
                {[
                  {
                    value: t("stats.modulesValue"),
                    label: t("stats.modulesLabel"),
                  },
                  {
                    value: t("stats.endpointsValue"),
                    label: t("stats.endpointsLabel"),
                  },
                  {
                    value: t("stats.coverageValue"),
                    label: t("stats.coverageLabel"),
                  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-cyan-300">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/6 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
                <div className="flex items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {t("preview.eyebrow")}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">
                      {t("preview.title")}
                    </h2>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {t("preview.badge")}
                  </div>
                </div>

                <div id="features" className="mt-5 grid gap-3">
                  {highlightItems.map((item) => (
                    <div
                      className="rounded-2xl border bg-slate-50 p-4 transition-colors hover:bg-white"
                      key={item.key}
                    >
                      <div className="flex gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                          <item.icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {t(`highlights.${item.key}.title`)}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                            {t(`highlights.${item.key}.description`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-linear-to-br from-slate-950 to-slate-900 p-4 text-white">
                  <p className="text-sm text-slate-400">
                    {t("preview.ctaTitle")}
                  </p>
                  <p className="mt-1 font-semibold">
                    {t("preview.ctaDescription")}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="mt-3 bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                  >
                    <Link href="/register">
                      {t("preview.cta")}
                      <ArrowRight className="ml-2 size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="border-y border-white/10 bg-slate-900/80 px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              {t("workflow.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {t("workflow.title")}
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              {t("workflow.description")}
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflowItems.map((item, index) => (
              <div
                className="rounded-3xl border border-white/10 bg-white/6 p-5"
                key={item.key}
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
                    <item.icon className="size-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-500">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">
                  {t(`workflow.steps.${item.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {t(`workflow.steps.${item.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="bg-slate-950 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              {t("modules.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {t("modules.title")}
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              {t("modules.description")}
            </p>
          </div>

          <div className="grid gap-3">
            {moduleItems.map((item) => (
              <div
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 p-4"
                key={item}
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cyan-300" />
                <p className="text-sm leading-6 text-slate-300">
                  {t(`modules.items.${item}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_34%),linear-gradient(135deg,#0f172a,#020617)] p-8 shadow-2xl shadow-cyan-950/30 md:p-12">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-cyan-200">
                <Languages className="size-4" />
                EN / VI
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
                {t("finalCta.title")}
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                {t("finalCta.description")}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              >
                <Link href="/register">
                  {t("finalCta.primary")}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

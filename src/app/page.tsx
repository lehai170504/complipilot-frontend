import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  LayoutDashboard,
  LockKeyhole,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Framework templates",
    description:
      "Start from compliance baselines and apply requirements directly to a workspace.",
    icon: ClipboardCheck,
  },
  {
    title: "Evidence vault",
    description:
      "Upload, organize, review, and export evidence for audit-ready workflows.",
    icon: FileCheck2,
  },
  {
    title: "AI evidence analysis",
    description:
      "Use AI to summarize evidence, detect risk, and suggest missing information.",
    icon: Bot,
  },
  {
    title: "Audit trail",
    description:
      "Track important actions across compliance, evidence, tasks, and workspace settings.",
    icon: ScrollText,
  },
  {
    title: "SaaS operations",
    description:
      "Manage billing usage, platform organizations, notifications, and system status.",
    icon: LayoutDashboard,
  },
  {
    title: "Secure workspace controls",
    description:
      "Role-based access, invitation flows, disabled workspace guard, and account security.",
    icon: LockKeyhole,
  },
];

const highlights = [
  "Compliance workspace management",
  "Evidence upload and download links",
  "Member invitations and regenerate links",
  "Billing-ready plan and usage limits",
  "Platform admin console",
  "CSV export for audit review",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-32 top-40 size-80 rounded-full bg-cyan-300/10 blur-3xl" />

        <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
              <ShieldCheck className="size-6" />
            </div>

            <div>
              <p className="font-bold tracking-tight">CompliPilot</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Compliance OS
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Login</Link>
            </Button>

            <Button
              asChild
              className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            >
              <Link href="/register">
                Get started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
              <Sparkles className="mr-2 size-4" />
              AI Compliance & Evidence OS
            </div>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              Build audit-ready compliance workflows faster.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              CompliPilot helps teams manage compliance controls, evidence,
              audit trails, AI analysis, workspace settings, and SaaS operations
              in one clean platform.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              >
                <Link href="/register">
                  Start your workspace
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Go to dashboard</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Readiness</p>
                  <p className="mt-3 text-3xl font-bold">86%</p>
                  <p className="mt-2 text-sm text-cyan-200">
                    Compliance controls ready
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Evidence</p>
                  <p className="mt-3 text-3xl font-bold">248</p>
                  <p className="mt-2 text-sm text-cyan-200">
                    Documents tracked
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Audit trail</p>
                  <p className="mt-3 text-3xl font-bold">1.2k</p>
                  <p className="mt-2 text-sm text-cyan-200">Events recorded</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-300/10 bg-cyan-300/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
                    <Bot className="size-5" />
                  </div>

                  <div>
                    <p className="font-semibold">AI evidence analysis</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      Summarize evidence, identify risks, detect missing
                      information, and suggest next actions for compliance
                      reviewers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Features
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Everything needed for an MVP compliance SaaS.
              </h2>
              <p className="mt-3 text-slate-300">
                Designed for teams that need structured controls, evidence,
                traceability, and production operations from day one.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-white/10 bg-white/[0.03] text-white"
                >
                  <CardContent className="p-6">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
                      <feature.icon className="size-5" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mt-20 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                  Built for SaaS
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Ready for product demos, testing, and future billing.
                </h2>
                <p className="mt-3 text-slate-300">
                  The product includes key SaaS foundations such as workspace
                  lifecycle, role-based access, notifications, usage limits,
                  platform admin controls, and system diagnostics.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cyan-300" />
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

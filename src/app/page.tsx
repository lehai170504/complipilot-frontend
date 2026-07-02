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
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      <section className="relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-40 size-80 rounded-full bg-accent/20 blur-[100px]" />

        {/* Header */}
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <p className="font-bold tracking-tight text-foreground">CompliPilot</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Compliance OS
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5"
            >
              <Link href="/register">
                Get started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-24">
          <div className="mx-auto max-w-4xl text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mx-auto mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <Sparkles className="mr-2 size-4 animate-pulse" />
              AI Compliance & Evidence OS
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl lg:leading-[1.1] bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Build audit-ready compliance workflows faster.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              CompliPilot helps teams manage compliance controls, evidence,
              audit trails, AI analysis, workspace settings, and SaaS operations
              in one clean platform.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 h-12 px-8 text-base"
              >
                <Link href="/register">
                  Start your workspace
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-border bg-card/50 text-foreground backdrop-blur-sm hover:bg-muted/50 hover:text-foreground transition-all h-12 px-8 text-base"
              >
                <Link href="/login">Go to dashboard</Link>
              </Button>
            </div>
          </div>

          {/* MacOS Window Mockup */}
          <div className="mt-20 mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            <div className="relative rounded-2xl border border-border/50 bg-card/40 shadow-2xl shadow-primary/10 backdrop-blur-2xl ring-1 ring-white/5 overflow-hidden">
              {/* MacOS Title Bar */}
              <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-destructive/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                  <div className="size-3 rounded-full bg-warning/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                  <div className="size-3 rounded-full bg-success/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <LockKeyhole className="size-3" />
                  complipilot.app
                </div>
                <div className="w-10"></div> {/* Spacer for symmetry */}
              </div>

              {/* Demo Content Inside Mockup */}
              <div className="aspect-[16/9] w-full bg-background/50 p-6 md:p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />

                <div className="relative h-full w-full rounded-xl border border-border/30 bg-card/80 shadow-2xl flex flex-col">
                  {/* Fake Dashboard Header */}
                  <div className="flex items-center justify-between border-b border-border/50 p-4 bg-muted/10">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <LayoutDashboard className="size-4 text-primary" />
                      </div>
                      <div className="h-4 w-32 rounded-md bg-muted/50"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-24 rounded-md bg-primary/10 border border-primary/20"></div>
                      <div className="h-8 w-8 rounded-full bg-muted/50"></div>
                    </div>
                  </div>

                  {/* Fake Dashboard Stats */}
                  <div className="p-6 grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-border/50 bg-background/50 p-5 shadow-sm">
                      <p className="text-sm font-medium text-muted-foreground">Readiness</p>
                      <p className="mt-2 text-3xl font-bold text-foreground">86%</p>
                      <div className="mt-3 h-1 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary w-[86%] rounded-full shadow-[0_0_10px_var(--primary)]"></div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-background/50 p-5 shadow-sm">
                      <p className="text-sm font-medium text-muted-foreground">Evidence</p>
                      <p className="mt-2 text-3xl font-bold text-foreground">248</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-success">
                        <ArrowRight className="size-3 -rotate-45" />
                        <span>+12 this week</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-background/50 p-5 shadow-sm relative overflow-hidden">
                      <div className="absolute right-0 top-0 p-4 opacity-10">
                        <Bot className="size-16" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">AI Insights</p>
                      <p className="mt-2 text-3xl font-bold text-foreground">1.2k</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                        <Sparkles className="size-3" />
                        <span>Risk detected</span>
                      </div>
                    </div>
                  </div>

                  {/* Fake Dashboard Main Area */}
                  <div className="px-6 pb-6 flex-1 flex gap-6">
                    <div className="flex-1 rounded-xl border border-border/50 bg-background/50 p-4">
                      <div className="h-5 w-40 rounded-md bg-muted/50 mb-4"></div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-12 w-full rounded-lg border border-border/30 bg-muted/10 flex items-center px-4 gap-4">
                            <div className="size-4 rounded-sm bg-primary/20"></div>
                            <div className="h-3 w-1/3 rounded-md bg-muted/40"></div>
                            <div className="ml-auto h-3 w-16 rounded-md bg-muted/30"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-32">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                Features
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                Everything needed for an MVP compliance SaaS.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Designed for teams that need structured controls, evidence,
                traceability, and production operations from day one.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-card/60 hover:shadow-xl hover:shadow-primary/5"
                >
                  <CardContent className="p-8">
                    <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="size-6" />
                    </div>

                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>

                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </Card>
              ))}
            </div>
          </section>

          <section className="mt-32 relative">
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border/50 shadow-2xl backdrop-blur-xl" />

            <div className="relative rounded-[3rem] p-10 md:p-16">
              <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                    Built for SaaS
                  </p>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Ready for product demos, testing, and future billing.
                  </h2>
                  <p className="mt-6 text-lg text-muted-foreground">
                    The product includes key SaaS foundations such as workspace
                    lifecycle, role-based access, notifications, usage limits,
                    platform admin controls, and system diagnostics.
                  </p>

                  <Button className="mt-8 bg-foreground text-background hover:bg-foreground/90 rounded-full px-8">
                    Explore Architecture
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/50 p-5 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="size-5" />
                      </div>
                      <span className="text-sm font-medium text-card-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

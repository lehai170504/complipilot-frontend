import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FileCheck2,
  ListChecks,
  ScrollText,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Compliance Controls",
    description: "Track requirements, update statuses with enforced workflow transitions, and manage due dates.",
    icon: ClipboardCheck,
  },
  {
    title: "Evidence Management",
    description: "Upload files via presigned URLs, link URL evidence, and build audit-ready traceability.",
    icon: FileCheck2,
  },
  {
    title: "Task Tracking",
    description: "Create, assign, prioritize, and resolve compliance action items with full CRUD.",
    icon: ListChecks,
  },
  {
    title: "Audit Trail",
    description: "Every compliance action is logged — filter, search, and sort through the full history.",
    icon: ScrollText,
  },
  {
    title: "Framework Library",
    description: "Seed security baselines or build custom frameworks with requirements and categories.",
    icon: BookOpen,
  },
];

export default function HomePage() {
  return (
    <main className="bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_36%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_30%)]" />
        <div className="absolute inset-0 compliance-grid-bg opacity-30" />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-8">
          <header className="flex items-center justify-between">
            <Link className="flex items-center gap-3" href="/">
              <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400/20 to-cyan-600/20 text-cyan-300 ring-1 ring-cyan-300/20">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-base font-bold tracking-tight">CompliPilot</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                  Compliance OS
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                <Link href="/register">Create account</Link>
              </Button>
            </div>
          </header>

          <div className="grid items-center gap-12 py-20 lg:grid-cols-[1fr_1fr] lg:py-28">
            <section>
              <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-200">
                AI Compliance &amp; Evidence OS
              </div>

              <h1 className="mt-8 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Turn compliance into a clear operating&nbsp;system.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Manage controls, evidence, tasks, frameworks, and audit history
                in one workspace — built for trust, speed, and audit readiness.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                  <Link href="/register">
                    Start demo workspace
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                <div>
                  <p className="text-2xl font-bold text-cyan-300">5</p>
                  <p className="mt-1 text-sm text-slate-400">Compliance modules</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-300">33</p>
                  <p className="mt-1 text-sm text-slate-400">API endpoints</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-300">100%</p>
                  <p className="mt-1 text-sm text-slate-400">Audit coverage</p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/6 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Platform capabilities</p>
                    <h2 className="mt-1 text-2xl font-bold">What&apos;s inside</h2>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    v0.9 ready
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {highlights.map((item) => (
                    <div className="rounded-2xl border bg-slate-50 p-4 transition-colors hover:bg-white" key={item.title}>
                      <div className="flex gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                          <item.icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{item.title}</p>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-linear-to-br from-slate-950 to-slate-900 p-4 text-white">
                  <p className="text-sm text-slate-400">Ready to start?</p>
                  <p className="mt-1 font-semibold">
                    Create a workspace, seed the security baseline, and go from zero to audit-ready in minutes.
                  </p>
                  <Button asChild size="sm" className="mt-3 bg-cyan-300 text-slate-950 hover:bg-cyan-200">
                    <Link href="/register">
                      Get started
                      <ArrowRight className="ml-2 size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
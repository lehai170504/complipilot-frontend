import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileCheck2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Controls",
    description: "Track compliance requirements, owners, statuses, and due dates.",
    icon: ClipboardCheck,
  },
  {
    title: "Evidence",
    description: "Upload, link, and review evidence with audit-ready traceability.",
    icon: FileCheck2,
  },
  {
    title: "Audit trail",
    description: "Follow every critical compliance action with request-level context.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_36%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_30%)]" />
        <div className="absolute inset-0 compliance-grid-bg opacity-30" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8">
          <header className="flex items-center justify-between">
            <Link className="flex items-center gap-3" href="/">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="font-bold tracking-tight">CompliPilot</p>
                <p className="text-xs text-slate-400">AI Compliance OS</p>
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

          <div className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr]">
            <section>
              <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-200">
                Evidence-first compliance workspace
              </div>

              <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
                Turn compliance work into a clear operating system.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Manage controls, evidence, deadlines, tasks, and audit history
                in one workspace built for trust, speed, and traceability.
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
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-5 text-slate-950">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Compliance overview</p>
                    <h2 className="mt-1 text-2xl font-bold">Audit readiness</h2>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    82% ready
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {highlights.map((item) => (
                    <div className="rounded-2xl border bg-slate-50 p-4" key={item.title}>
                      <div className="flex gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                          <item.icon className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
                  <p className="text-sm text-slate-400">Next priority</p>
                  <p className="mt-1 font-semibold">Upload MFA evidence before review deadline</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
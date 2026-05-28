import { BrandMark } from "@/components/brand/brand-mark";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#0e7490_0,#020617_34%,#020617_100%)] text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1fr_440px] lg:items-center">
        <section className="hidden lg:block">
          <BrandMark />

          <div className="mt-16 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Built for compliance operations
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
              Turn compliance work into a clear operating system.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Manage controls, evidence, owners, deadlines, and audit history in
              one workspace designed for trust, traceability, and speed.
            </p>
          </div>

          <div className="mt-10 grid max-w-2xl gap-4">
            {[
              "Evidence-first workflows with upload and linking",
              "Task ownership, filters, search, sorting, and audit trail",
              "Request ID tracing for production-grade support",
            ].map((item) => (
              <div
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-slate-200 shadow-2xl shadow-cyan-950/20 backdrop-blur"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section>{children}</section>
      </div>
    </main>
  );
}
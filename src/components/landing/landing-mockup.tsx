import { ArrowRight, Bot, LayoutDashboard, LockKeyhole, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function LandingMockup() {
  const t = useTranslations("landing.mockupNew");

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-slate-900/5 sm:rounded-2xl">
        {/* MacOS Title Bar */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2 sm:px-4 sm:py-3">
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
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-background/50 p-2 sm:aspect-[16/9] sm:p-6 md:p-10">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />

          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-card sm:rounded-xl">
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
            <div className="grid gap-1.5 p-2 sm:grid-cols-3 sm:gap-3 sm:p-4 md:gap-6 md:p-6">
              <div className="rounded-lg border border-border bg-background p-2 sm:rounded-xl sm:p-4 md:p-5">
                <p className="text-sm font-medium text-muted-foreground">{t("readiness")}</p>
                <p className="mt-1 text-xl font-bold text-foreground sm:mt-2 sm:text-3xl">86%</p>
                <div className="mt-3 h-1 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary w-[86%] rounded-full shadow-[0_0_10px_var(--primary)]"></div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-2 sm:rounded-xl sm:p-4 md:p-5">
                <p className="text-sm font-medium text-muted-foreground">{t("evidence")}</p>
                <p className="mt-1 text-xl font-bold text-foreground sm:mt-2 sm:text-3xl">248</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-success">
                  <ArrowRight className="size-3 -rotate-45" />
                  <span>{t("thisWeek")}</span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-border bg-background p-2 sm:rounded-xl sm:p-4 md:p-5">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <Bot className="size-16" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">{t("aiInsights")}</p>
                <p className="mt-1 text-xl font-bold text-foreground sm:mt-2 sm:text-3xl">1.2k</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                  <Sparkles className="size-3" />
                  <span>{t("riskDetected")}</span>
                </div>
              </div>
            </div>

            {/* Fake Dashboard Main Area */}
            <div className="hidden flex-1 gap-6 px-6 pb-6 sm:flex">
              <div className="flex-1 rounded-xl border border-border bg-background p-4">
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
  );
}

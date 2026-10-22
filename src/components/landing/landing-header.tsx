import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function LandingHeader() {
  const t = useTranslations("landing");

  return (
    <div className="fixed left-3 right-3 top-3 z-50 mx-auto max-w-7xl animate-in fade-in slide-in-from-top-4 duration-700 sm:left-6 sm:right-6 sm:top-6">
      <header className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm sm:gap-8 sm:rounded-full sm:px-4">
        <Link href="/" className="ml-1 flex shrink-0 items-center gap-2 group sm:ml-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <ShieldCheck className="size-4" />
          </div>
          <span className="font-bold tracking-tight text-foreground">CompliPilot</span>
        </Link>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <LanguageSwitcher />

          <Button
            asChild
            variant="ghost"
            className="hidden h-9 rounded-full px-3 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground sm:inline-flex sm:px-4"
          >
            <Link href="/login">{t("nav.signIn")}</Link>
          </Button>
          <Button
            asChild
            className="h-9 rounded-lg px-3 text-xs sm:rounded-full sm:px-5 sm:text-sm"
          >
            <Link href="/register">
              {t("nav.createAccount")}
              <ArrowRight className="ml-2 size-3.5" />
            </Link>
          </Button>
        </div>
      </header>
    </div>
  );
}

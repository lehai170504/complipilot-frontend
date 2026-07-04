import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function LandingHeader() {
  const t = useTranslations("landing");

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
      <header className="flex items-center justify-between gap-8 rounded-full border border-border/50 bg-background/70 px-4 py-2 shadow-xl shadow-black/5 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 group ml-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <ShieldCheck className="size-4" />
          </div>
          <span className="font-bold tracking-tight text-foreground">CompliPilot</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <Button
            asChild
            variant="ghost"
            className="rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors h-9 px-4 text-sm"
          >
            <Link href="/login">{t("nav.signIn")}</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:-translate-y-0.5 h-9 px-5 text-sm"
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

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export function LandingFooter() {
  const t = useTranslations("landing.footerNew");

  return (
    <footer className="relative z-10 border-t border-border/50 bg-background/50 backdrop-blur-lg mt-32 py-12">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <p className="font-bold tracking-tight text-foreground">CompliPilot</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Compliance OS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">{t("about")}</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">{t("privacy")}</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">{t("terms")}</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">{t("contact")}</Link>
        </div>

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CompliPilot. {t("rights")}
        </p>
      </div>
    </footer>
  );
}

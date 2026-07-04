import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  const t = useTranslations("landing");

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-4xl text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mx-auto mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
          <Sparkles className="mr-2 size-4 animate-pulse" />
          {t("hero.eyebrow")}
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl lg:leading-[1.1] bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
          {t("hero.title")}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t("hero.description")}
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 h-12 px-8 text-base rounded-full"
          >
            <Link href="/register">
              {t("hero.primaryCta")}
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-border bg-card/50 text-foreground backdrop-blur-sm hover:bg-muted/50 hover:text-foreground transition-all h-12 px-8 text-base"
          >
            <Link href="/login">{t("hero.secondaryCta")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

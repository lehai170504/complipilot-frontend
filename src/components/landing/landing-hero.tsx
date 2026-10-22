import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  const t = useTranslations("landing");

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-36 lg:pb-20">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
          <Sparkles className="mr-2 size-4" />
          {t("hero.eyebrow")}
        </div>

        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-7xl">
          {t("hero.title")}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
          {t("hero.description")}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Button
            asChild
            size="lg"
            className="h-11 rounded-lg px-6 text-sm sm:h-12 sm:rounded-full sm:px-8 sm:text-base"
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
            className="h-11 rounded-lg px-6 text-sm sm:h-12 sm:rounded-full sm:px-8 sm:text-base"
          >
            <Link href="/login">{t("hero.secondaryCta")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

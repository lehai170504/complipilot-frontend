import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const highlights = [
  0,
  1,
  2,
  3,
  4,
  5,
];

export function LandingHighlights() {
  const t = useTranslations("landing.highlightsNew");

  return (
    <section className="relative z-10 mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
      <div className="absolute inset-x-4 inset-y-0 -z-10 rounded-2xl border border-border bg-card sm:inset-x-6 sm:rounded-3xl" />

      <div className="relative rounded-2xl p-5 sm:rounded-3xl sm:p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:mt-6 sm:text-base">
              {t("description")}
            </p>

            <Button className="mt-6 sm:mt-8">
              {t("cta")}
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 sm:gap-4 sm:p-5"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="size-5" />
                </div>
                <span className="text-sm font-medium text-card-foreground">{t(`items.${item}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

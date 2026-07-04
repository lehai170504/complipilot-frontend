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
    <section className="relative z-10 mx-auto max-w-7xl px-6 mt-32">
      <div className="absolute inset-x-6 inset-y-0 rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border/50 shadow-2xl backdrop-blur-xl -z-10" />

      <div className="relative rounded-[3rem] p-10 md:p-16">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              {t("eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              {t("description")}
            </p>

            <Button className="mt-8 bg-foreground text-background hover:bg-foreground/90 rounded-full px-8">
              {t("cta")}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/50 p-5 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-md"
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

import { Bot, ClipboardCheck, FileCheck2, LayoutDashboard, LockKeyhole, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    key: "Framework templates",
    icon: ClipboardCheck,
  },
  {
    key: "Evidence vault",
    icon: FileCheck2,
  },
  {
    key: "AI evidence analysis",
    icon: Bot,
  },
  {
    key: "Audit trail",
    icon: ScrollText,
  },
  {
    key: "SaaS operations",
    icon: LayoutDashboard,
  },
  {
    key: "Secure workspace controls",
    icon: LockKeyhole,
  },
];

export function LandingFeatures() {
  const t = useTranslations("landing.featuresNew");

  return (
    <section className="relative z-10 mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:mt-4 sm:text-3xl md:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base">
          {t("description")}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {features.map((feature, idx) => (
          <Card
            key={feature.key}
            className="group relative overflow-hidden border-border bg-card transition-colors hover:border-primary/30"
          >
            <CardContent className="p-5 sm:p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:mb-5 sm:size-11">
                <feature.icon className="size-5" />
              </div>

              <h3 className="text-base font-semibold text-foreground sm:text-lg">
                {t(`items.${idx}.title`)}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(`items.${idx}.description`)}
              </p>
            </CardContent>

          </Card>
        ))}
      </div>
    </section>
  );
}

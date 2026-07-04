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
    <section className="relative z-10 mx-auto max-w-7xl px-6 mt-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          {t("eyebrow")}
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl text-foreground">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, idx) => (
          <Card
            key={feature.key}
            className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-card/60 hover:shadow-xl hover:shadow-primary/5"
          >
            <CardContent className="p-8">
              <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="size-6" />
              </div>

              <h3 className="text-xl font-semibold text-foreground">
                {t(`items.${idx}.title`)}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(`items.${idx}.description`)}
              </p>
            </CardContent>

            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
          </Card>
        ))}
      </div>
    </section>
  );
}

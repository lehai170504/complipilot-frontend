import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="compliance-surface group relative">
      <CardContent className="flex items-start justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground sm:text-sm">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">{value}</p>
          {description ? (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-[18px]" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
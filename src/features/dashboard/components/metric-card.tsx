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
    <Card className="compliance-surface">
      <CardContent className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{value}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <Icon className="size-[18px]" />
        </div>
      </CardContent>
    </Card>
  );
}
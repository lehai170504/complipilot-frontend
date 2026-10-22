import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function ManagementPageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("management-page-header", className)}>
      {Icon ? (
        <div className="management-page-header__icon" aria-hidden="true">
          <Icon className="size-5" />
        </div>
      ) : null}

      <div className="management-page-header__copy">
        <p className="management-page-header__eyebrow">{eyebrow}</p>
        <h2 className="management-page-header__title">{title}</h2>
        {description ? (
          <p className="management-page-header__description">{description}</p>
        ) : null}
      </div>

      {actions ? (
        <div className="management-page-header__actions">{actions}</div>
      ) : null}
    </section>
  );
}

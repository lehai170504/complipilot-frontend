"use client";

import { ReactNode, useId, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Collapsible filter bar — auto-collapses on mobile, expandable via toggle.
 * On desktop (lg+), filters are always visible.
 * On mobile (<lg), click "Filters" to expand/collapse.
 */
export function FilterBar({
  children,
  className,
  actions,
}: {
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const filterContentId = useId();
  const t = useTranslations("common");

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-none",
        className
      )}
    >
      {/* Mobile toggle + always-visible actions */}
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 p-3 lg:hidden">
        <Button
          aria-controls={filterContentId}
          aria-expanded={isOpen}
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <SlidersHorizontal className="mr-2 size-4" />
          {t("filters")}
          {isOpen ? (
            <X className="ml-2 size-3" />
          ) : null}
        </Button>
        {actions ? (
          <div className="flex min-w-0 flex-1 flex-wrap justify-end gap-2">
            {actions}
          </div>
        ) : null}
      </div>

      {/* Filter content: always visible on desktop, collapsible on mobile */}
      <div
        id={filterContentId}
        className={cn(
          "p-3 lg:p-4",
          "hidden lg:block", // desktop: always show
          isOpen && "block" // mobile: show when open
        )}
      >
        <div className="grid min-w-0 grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
          {children}
        </div>
      </div>

      {/* Desktop actions row */}
      {actions ? (
        <div className="hidden border-t px-4 py-3 lg:flex lg:justify-end">{actions}</div>
      ) : null}
    </div>
  );
}

"use client";

import { ReactNode, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

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

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white shadow-sm",
        className
      )}
    >
      {/* Mobile toggle + always-visible actions */}
      <div className="flex items-center justify-between p-3 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <SlidersHorizontal className="mr-2 size-4" />
          Filters
          {isOpen ? (
            <X className="ml-2 size-3" />
          ) : null}
        </Button>
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>

      {/* Filter content: always visible on desktop, collapsible on mobile */}
      <div
        className={cn(
          "p-3 lg:p-4",
          "hidden lg:block", // desktop: always show
          isOpen && "block" // mobile: show when open
        )}
      >
        <div className="flex flex-wrap items-end gap-3">{children}</div>
      </div>

      {/* Desktop actions row */}
      {actions ? (
        <div className="hidden border-t px-4 py-3 lg:flex lg:justify-end">{actions}</div>
      ) : null}
    </div>
  );
}

"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setClientLocale } from "@/i18n/locale-cookie";
import type { AppLocale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("language");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: string) {
    startTransition(() => {
      setClientLocale(nextLocale as AppLocale);
      window.location.reload();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 bg-white/70"
          disabled={isPending}
        >
          <Languages className="size-4" />
          {locale === "vi" ? t("shortVietnamese") : t("shortEnglish")}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          <DropdownMenuRadioItem value="en">
            {t("english")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="vi">
            {t("vietnamese")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
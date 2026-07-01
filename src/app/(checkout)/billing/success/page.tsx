"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function BillingSuccessPage() {
  const t = useTranslations("billing");
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-emerald-100">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="size-10" />
          </div>
          
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
            {t("success.title")}
          </h2>
          
          <p className="mb-8 text-slate-500">
            {t("success.description")}
          </p>
          
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Link href="/billing">
              {t("success.returnBtn")} <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

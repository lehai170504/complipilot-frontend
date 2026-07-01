"use client";

import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function BillingCancelPage() {
  const t = useTranslations("billing");
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <XCircle className="size-10" />
          </div>
          
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
            {t("cancel.title")}
          </h2>
          
          <p className="mb-8 text-slate-500">
            {t("cancel.description")}
          </p>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/billing">
              <ArrowLeft className="mr-2 size-4" /> {t("cancel.returnBtn")}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

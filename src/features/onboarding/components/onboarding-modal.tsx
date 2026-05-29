"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  DatabaseZap,
  FileCheck2,
  ScrollText,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSeedDemoWorkspaceMutation } from "@/features/compliance/hooks/compliance-hooks";

const onboardingSteps = [
  {
    key: "framework",
    icon: BookOpen,
  },
  {
    key: "controls",
    icon: ClipboardCheck,
  },
  {
    key: "evidence",
    icon: FileCheck2,
  },
  {
    key: "audit",
    icon: ScrollText,
  },
] as const;

export function OnboardingModal({
  open,
  onOpenChange,
  organizationId,
  onDismissPermanently,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
  onDismissPermanently: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("onboarding");
  const seedDemoWorkspaceMutation = useSeedDemoWorkspaceMutation();

  function handleSeedDemoWorkspace() {
    if (!organizationId) {
      return;
    }

    seedDemoWorkspaceMutation.mutate(organizationId);
  }

  function handleGoDashboard() {
    onOpenChange(false);
    router.push("/dashboard");
  }

  function handleGoEvidence() {
    onOpenChange(false);
    router.push("/evidence");
  }

  function handleDismissPermanently() {
    onDismissPermanently();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-3xl">
        <div className="bg-slate-950 p-6 text-white">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300">
                  {t("eyebrow")}
                </p>
                <DialogTitle className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {t("title")}
                </DialogTitle>
                <DialogDescription className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                  {t("description")}
                </DialogDescription>
              </div>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-slate-400 hover:bg-white/10 hover:text-white"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-5 bg-white p-6">
          <div className="grid gap-3 md:grid-cols-2">
            {onboardingSteps.map((step) => (
              <div
                key={step.key}
                className="rounded-2xl border bg-slate-50 p-4"
              >
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-cyan-300">
                    <step.icon className="size-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {t(`steps.${step.key}.title`)}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {t(`steps.${step.key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
            {t("tip")}
          </div>

          {seedDemoWorkspaceMutation.isSuccess ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              {t("success", {
                createdCount: seedDemoWorkspaceMutation.data.createdCount,
                skippedCount: seedDemoWorkspaceMutation.data.skippedCount,
              })}
            </div>
          ) : null}

          {seedDemoWorkspaceMutation.error ? (
            <ErrorAlert error={seedDemoWorkspaceMutation.error} />
          ) : null}

          <div className="flex flex-col justify-between gap-3 border-t pt-5 md:flex-row md:items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDismissPermanently}
              className="justify-start text-slate-500 hover:text-slate-700"
            >
              {t("actions.dontShowAgain")}
            </Button>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoEvidence}
              >
                {t("actions.goEvidence")}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoDashboard}
              >
                {t("actions.goDashboard")}
              </Button>

              <Button
                type="button"
                onClick={handleSeedDemoWorkspace}
                disabled={
                  !organizationId || seedDemoWorkspaceMutation.isPending
                }
                className="bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              >
                <DatabaseZap className="mr-2 size-4" />
                {seedDemoWorkspaceMutation.isPending
                  ? t("actions.seeding")
                  : t("actions.seedDemo")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

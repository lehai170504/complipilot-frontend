"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  FileCheck2,
  ScrollText,
  ShieldCheck,
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
import { cn } from "@/lib/utils";
import { useSeedDemoWorkspaceMutation } from "@/features/compliance/hooks/compliance-hooks";

const onboardingSlides = [
  {
    key: "welcome",
    icon: ShieldCheck,
  },
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

  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = onboardingSlides[activeIndex];
  const ActiveIcon = activeSlide.icon;
  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === onboardingSlides.length - 1;

  function handleSeedDemoWorkspace() {
    if (!organizationId) {
      return;
    }

    seedDemoWorkspaceMutation.mutate(organizationId);
  }

  function handleNext() {
    if (isLastSlide) {
      onOpenChange(false);
      return;
    }

    setActiveIndex((current) =>
      Math.min(current + 1, onboardingSlides.length - 1),
    );
  }

  function handleBack() {
    setActiveIndex((current) => Math.max(current - 1, 0));
  }

  function handleGoEvidence() {
    onOpenChange(false);
    router.push("/evidence");
  }

  function handleDismissPermanently() {
    onDismissPermanently();
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (nextOpen) {
      setActiveIndex(0);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-4xl">
        <div className="grid min-h-[620px] lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="relative overflow-hidden bg-slate-950 p-6 text-white">
            <div className="absolute -left-24 -top-24 size-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-28 right-0 size-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between">
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300">
                      {t("eyebrow")}
                    </p>
                    <DialogTitle className="mt-3 text-3xl font-bold tracking-tight text-white">
                      {t("title")}
                    </DialogTitle>
                    <DialogDescription className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
                      {t("description")}
                    </DialogDescription>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="size-5" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="mt-8 space-y-3">
                {onboardingSlides.map((slide, index) => {
                  const StepIcon = slide.icon;
                  const isActive = index === activeIndex;
                  const isCompleted = index < activeIndex;

                  return (
                    <button
                      key={slide.key}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all",
                        isActive
                          ? "border-cyan-300/30 bg-cyan-300/10 text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-xl",
                          isActive || isCompleted
                            ? "bg-cyan-300 text-slate-950"
                            : "bg-white/10 text-slate-400",
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="size-5" />
                        ) : (
                          <StepIcon className="size-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {t(`slides.${slide.key}.title` as never)}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {t("actions.stepCounter", {
                            current: index + 1,
                            total: onboardingSlides.length,
                          })}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-8 rounded-2xl border border-cyan-300/10 bg-cyan-300/10 p-4 text-sm text-cyan-100">
                {t("tip")}
              </div>
            </div>
          </aside>

          <section className="relative flex flex-col bg-white">
            <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
              <div>
                <div className="flex items-center justify-between gap-4 pr-10">
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {t("actions.stepCounter", {
                      current: activeIndex + 1,
                      total: onboardingSlides.length,
                    })}
                  </div>

                  <div className="flex gap-1.5">
                    {onboardingSlides.map((slide, index) => (
                      <button
                        key={slide.key}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                          "h-2.5 rounded-full transition-all",
                          index === activeIndex
                            ? "w-8 bg-cyan-500"
                            : "w-2.5 bg-slate-200 hover:bg-slate-300",
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <div className="flex size-16 items-center justify-center rounded-3xl bg-slate-950 text-cyan-300 shadow-xl shadow-cyan-950/10">
                    <ActiveIcon className="size-8" />
                  </div>

                  <h3 className="mt-6 max-w-xl text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                    {t(`slides.${activeSlide.key}.title` as never)}
                  </h3>

                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                    {t(`slides.${activeSlide.key}.description` as never)}
                  </p>

                  <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-900">
                    {t(`slides.${activeSlide.key}.highlight` as never)}
                  </div>
                </div>

                {seedDemoWorkspaceMutation.isSuccess ? (
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    {t("success", {
                      createdCount: seedDemoWorkspaceMutation.data.createdCount,
                      skippedCount: seedDemoWorkspaceMutation.data.skippedCount,
                    })}
                  </div>
                ) : null}

                {seedDemoWorkspaceMutation.error ? (
                  <div className="mt-6">
                    <ErrorAlert error={seedDemoWorkspaceMutation.error} />
                  </div>
                ) : null}
              </div>

              <div className="mt-8 space-y-4 border-t pt-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
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

                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isFirstSlide}
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    {t("actions.back")}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-slate-950 text-white hover:bg-slate-800"
                  >
                    {isLastSlide ? t("actions.finish") : t("actions.next")}
                    {!isLastSlide ? (
                      <ArrowRight className="ml-2 size-4" />
                    ) : null}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Crown,
  Loader2,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrganizationUsageCard } from "@/features/billing/components/organization-usage-card";
import { PlanChangeHistoryCard } from "@/features/billing/components/plan-change-history-card";
import { RequestPlanChangeDialog } from "@/features/billing/components/request-plan-change-dialog";
import { UsageLimitWarningCard } from "@/features/billing/components/usage-limit-warning-card";
import {
  useCancelBillingPlanChangeRequestMutation,
  useCreateCheckoutSessionMutation,
  useLatestBillingPlanChangeRequestQuery,
  useOrganizationUsageQuery,
} from "@/features/billing/hooks/billing-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import type { SubscriptionPlan } from "@/lib/api/api-types";
import { useTranslations } from "next-intl";

type PlanCard = {
  name: SubscriptionPlan;
  highlight?: boolean;
};

const plans: PlanCard[] = [
  { name: "FREE" },
  { name: "PRO", highlight: true },
  { name: "BUSINESS" },
  { name: "ENTERPRISE" },
];

const planRank: Record<SubscriptionPlan, number> = {
  FREE: 0,
  PRO: 1,
  BUSINESS: 2,
  ENTERPRISE: 3,
};

function getPlanActionLabel(
  currentPlan: SubscriptionPlan | undefined,
  targetPlan: SubscriptionPlan,
  t: any
) {
  if (!currentPlan) {
    return t("selectPlan");
  }

  if (currentPlan === targetPlan) {
    return t("currentPlan");
  }

  if (targetPlan === "ENTERPRISE") {
    return t("contactSales");
  }

  if (planRank[targetPlan] > planRank[currentPlan]) {
    return t("upgrade");
  }

  return t("downgrade");
}

function isUpgrade(
  currentPlan: SubscriptionPlan | undefined,
  targetPlan: SubscriptionPlan,
) {
  if (!currentPlan) {
    return false;
  }

  return planRank[targetPlan] > planRank[currentPlan];
}

function planTone(plan: SubscriptionPlan) {
  switch (plan) {
    case "FREE":
      return "bg-muted text-muted-foreground hover:bg-muted/80";
    case "PRO":
      return "bg-info/10 text-info hover:bg-info/20";
    case "BUSINESS":
      return "bg-primary/10 text-primary hover:bg-primary/20";
    case "ENTERPRISE":
      return "bg-warning/10 text-warning hover:bg-warning/20";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted/80";
  }
}

function requestStatusTone(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-warning/10 text-warning hover:bg-warning/20";
    case "APPROVED":
      return "bg-success/10 text-success hover:bg-success/20";
    case "REJECTED":
      return "bg-destructive/10 text-destructive hover:bg-destructive/20";
    case "CANCELLED":
      return "bg-muted text-muted-foreground hover:bg-muted/80";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted/80";
  }
}

export default function BillingPage() {
  const t = useTranslations("billing");

  const { activeOrganization } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const usageQuery = useOrganizationUsageQuery(organizationId);
  const latestPlanChangeRequestQuery =
    useLatestBillingPlanChangeRequestQuery(organizationId);
  const checkoutMutation = useCreateCheckoutSessionMutation(organizationId);

  const [isRequestPlanDialogOpen, setIsRequestPlanDialogOpen] = useState(false);
  const [selectedPlanForRequest, setSelectedPlanForRequest] = useState<
    SubscriptionPlan | undefined
  >(undefined);

  const cancelPlanChangeRequestMutation =
    useCancelBillingPlanChangeRequestMutation(organizationId);

  const currentPlan = usageQuery.data?.plan;
  const latestPlanChangeRequest = latestPlanChangeRequestQuery.data;
  const hasPendingPlanChangeRequest =
    latestPlanChangeRequest?.status === "PENDING";

  function scrollToPlans() {
    document.getElementById("billing-plans")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function openPlanRequestDialog(plan: SubscriptionPlan) {
    setSelectedPlanForRequest(plan);
    setIsRequestPlanDialogOpen(true);
  }

  function handlePlanDialogOpenChange(nextOpen: boolean) {
    setIsRequestPlanDialogOpen(nextOpen);

    if (!nextOpen) {
      setSelectedPlanForRequest(undefined);
    }
  }

  function handlePlanAction(plan: SubscriptionPlan) {
    if (!organizationId || !currentPlan || plan === currentPlan) {
      return;
    }

    if (!isUpgrade(currentPlan, plan)) {
      openPlanRequestDialog(plan);
      return;
    }

    checkoutMutation.mutate(
      {
        plan,
      },
      {
        onSuccess: (data) => {
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
            return;
          }

          openPlanRequestDialog(plan);
        },
      },
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700 ease-out pb-10">
      <section className="compliance-hero">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              <Sparkles className="mr-2 inline size-4 -mt-1" />
              {t("eyebrow")}
            </p>
            <h2 className="mt-4 max-w-3xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div className="group flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-300 hover:scale-110 lg:size-16">
            <WalletCards className="size-6 transition-transform duration-300 group-hover:rotate-12 lg:size-8" />
          </div>
        </div>
      </section>

      {usageQuery.error ? <ErrorAlert error={usageQuery.error} /> : null}

      {latestPlanChangeRequestQuery.error ? (
        <ErrorAlert error={latestPlanChangeRequestQuery.error} />
      ) : null}

      {checkoutMutation.error ? (
        <ErrorAlert error={checkoutMutation.error} />
      ) : null}

      {usageQuery.isLoading ? (
        <Card>
          <CardContent className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {t("loadingUsage")}
          </CardContent>
        </Card>
      ) : usageQuery.data ? (
        <>
          <OrganizationUsageCard usage={usageQuery.data} />

          <UsageLimitWarningCard
            usage={usageQuery.data}
            onUpgradeClick={scrollToPlans}
          />
        </>
      ) : null}

      {latestPlanChangeRequest ? (
        <Card>
          <CardContent className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("latestRequest")}
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                {latestPlanChangeRequest.currentPlan} →{" "}
                {latestPlanChangeRequest.requestedPlan}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {t("requestedBy", { email: latestPlanChangeRequest.requestedByEmail })}
              </p>

              {latestPlanChangeRequest.reviewedByEmail ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("reviewedBy", { email: latestPlanChangeRequest.reviewedByEmail })}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={requestStatusTone(latestPlanChangeRequest.status)}
              >
                {latestPlanChangeRequest.status}
              </Badge>

              {latestPlanChangeRequest.status === "PENDING" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={cancelPlanChangeRequestMutation.isPending}
                  onClick={() =>
                    cancelPlanChangeRequestMutation.mutate(
                      latestPlanChangeRequest.id,
                    )
                  }
                >
                  {cancelPlanChangeRequestMutation.isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : null}
                  {t("cancelRequest")}
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <section id="billing-plans" className="scroll-mt-10">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              {t("plansEyebrow")}
            </p>

            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t("plansTitle")}
            </h3>

            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              {t("plansDescription")}
            </p>
          </div>

          <Badge variant="secondary" className="w-fit bg-primary/10 text-primary hover:bg-primary/20">
            <Sparkles className="mr-2 size-3.5" />
            {t("stripePlaceholder")}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.name;
            const actionLabel = getPlanActionLabel(currentPlan, plan.name, t);
            const isDisabled =
              !organizationId ||
              isCurrentPlan ||
              hasPendingPlanChangeRequest ||
              checkoutMutation.isPending;

            const planDetails = {
              price: plan.name === "FREE" ? "$0" : plan.name === "PRO" ? "$19" : plan.name === "BUSINESS" ? "$99" : "Custom",
              title: t(`plans.${plan.name}.title`),
              description: t(`plans.${plan.name}.description`),
              features: t.raw(`plans.${plan.name}.features`) as string[],
            };

            return (
              <Card
                key={plan.name}
                className={`relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${isCurrentPlan
                    ? "border-primary ring-1 ring-primary shadow-primary/10"
                    : plan.highlight
                      ? "border-border shadow-lg"
                      : "border-border/50 hover:border-border"
                  }`}
              >
                {/* Decorative Top Accent for Highlighted Plan */}
                {plan.highlight && !isCurrentPlan && (
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary to-accent" />
                )}

                {/* Current Plan Top Accent */}
                {isCurrentPlan && (
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />
                )}

                <CardContent className="flex h-full flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                          {planDetails.title}
                        </p>

                        {plan.highlight && !isCurrentPlan ? (
                          <div className="rounded-full bg-primary/10 p-1 text-primary">
                            <Crown className="size-3.5" />
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-3 flex items-baseline gap-1">
                        <h4 className="text-4xl font-extrabold tracking-tight text-foreground">
                          {planDetails.price}
                        </h4>
                        {plan.name !== "ENTERPRISE" && (
                          <span className="text-sm font-medium text-muted-foreground">/mo</span>
                        )}
                      </div>
                    </div>

                    {isCurrentPlan ? (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {t("currentPlan")}
                      </Badge>
                    ) : null}
                  </div>

                  <p className="mt-4 min-h-[3rem] text-sm leading-relaxed text-muted-foreground">
                    {planDetails.description}
                  </p>

                  <div className="my-8 flex-1 space-y-4">
                    {planDetails.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-sm text-foreground/90"
                      >
                        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle2 className="size-3.5 text-primary" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    className={`mt-auto w-full font-semibold transition-all ${plan.highlight && !isCurrentPlan && !isDisabled
                        ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/25"
                        : ""
                      }`}
                    disabled={isDisabled}
                    variant={isCurrentPlan ? "secondary" : plan.highlight ? "default" : "outline"}
                    onClick={() => handlePlanAction(plan.name)}
                  >
                    {checkoutMutation.isPending && !isCurrentPlan ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : isUpgrade(currentPlan, plan.name) ? (
                      <CreditCard className="mr-2 size-4" />
                    ) : (
                      <Sparkles className="mr-2 size-4" />
                    )}

                    {isCurrentPlan
                      ? t("currentPlan")
                      : hasPendingPlanChangeRequest
                        ? t("requestPending")
                        : checkoutMutation.isPending
                          ? t("preparingCheckout")
                          : actionLabel}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <PlanChangeHistoryCard organizationId={organizationId} />

      <RequestPlanChangeDialog
        key={selectedPlanForRequest ?? "none"}
        open={isRequestPlanDialogOpen}
        onOpenChange={handlePlanDialogOpenChange}
        organizationId={organizationId}
        currentPlan={usageQuery.data?.plan}
        initialRequestedPlan={selectedPlanForRequest}
      />
    </div>
  );
}

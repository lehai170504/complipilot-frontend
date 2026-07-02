"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  CreditCard,
  Crown,
  Loader2,
  Sparkles,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RequestPlanChangeDialog } from "@/features/billing/components/request-plan-change-dialog";
import {
  useCreateCheckoutSessionMutation,
  useLatestBillingPlanChangeRequestQuery,
  useOrganizationUsageQuery,
} from "@/features/billing/hooks/billing-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import type { SubscriptionPlan } from "@/lib/api/api-types";

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

export function UpgradePlanModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("billing");
  const tModal = useTranslations("upgradePlanModal");
  const { activeOrganization } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const usageQuery = useOrganizationUsageQuery(organizationId);
  const latestPlanChangeRequestQuery = useLatestBillingPlanChangeRequestQuery(organizationId);
  const checkoutMutation = useCreateCheckoutSessionMutation(organizationId);

  const [isRequestPlanDialogOpen, setIsRequestPlanDialogOpen] = useState(false);
  const [selectedPlanForRequest, setSelectedPlanForRequest] = useState<SubscriptionPlan | undefined>(undefined);

  const currentPlan = usageQuery.data?.plan;
  const latestPlanChangeRequest = latestPlanChangeRequestQuery.data;
  const hasPendingPlanChangeRequest = latestPlanChangeRequest?.status === "PENDING";

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
      { plan },
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-6xl p-0 overflow-hidden bg-background">
          <DialogHeader className="p-6 pb-2 border-b bg-background text-left">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                  <Crown className="size-6 text-amber-500" />
                  {tModal("title")}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {tModal("description")}
                </DialogDescription>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex bg-primary/10 text-primary">
                <Sparkles className="mr-2 size-3.5" />
                {t("stripePlaceholder")}
              </Badge>
            </div>
          </DialogHeader>

          <div className="p-5 overflow-y-auto max-h-[85vh] bg-muted/30">
            {checkoutMutation.error ? <ErrorAlert error={checkoutMutation.error} /> : null}

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 pb-4">
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
                    className={`relative flex flex-col overflow-hidden transition-all duration-300 bg-background ${isCurrentPlan
                      ? "border-primary ring-1 ring-primary shadow-primary/10"
                      : plan.highlight
                        ? "border-border shadow-lg"
                        : "border-border/50"
                      }`}
                  >
                    {plan.highlight && !isCurrentPlan && (
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary to-accent" />
                    )}
                    {isCurrentPlan && (
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />
                    )}

                    <CardContent className="flex h-full flex-col p-5 sm:p-6">
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
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {t("currentPlan")}
                          </Badge>
                        ) : null}
                      </div>

                      <p className="mt-4 min-h-[3rem] text-sm leading-relaxed text-muted-foreground">
                        {planDetails.description}
                      </p>

                      <div className="my-6 flex-1 space-y-3">
                        {planDetails.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3 text-sm text-foreground/90">
                            <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <CheckCircle2 className="size-3 text-primary" />
                            </div>
                            <span className="leading-snug">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        className={`mt-auto w-full font-semibold transition-all ${plan.highlight && !isCurrentPlan && !isDisabled
                          ? "bg-primary text-primary-foreground shadow-md"
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
          </div>
        </DialogContent>
      </Dialog>

      <RequestPlanChangeDialog
        key={selectedPlanForRequest ?? "none"}
        open={isRequestPlanDialogOpen}
        onOpenChange={handlePlanDialogOpenChange}
        organizationId={organizationId}
        currentPlan={usageQuery.data?.plan}
        initialRequestedPlan={selectedPlanForRequest}
      />
    </>
  );
}

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
  title: string;
  price: string;
  description: string;
  highlight?: boolean;
  features: string[];
};

const plans: PlanCard[] = [
  {
    name: "FREE",
    title: "Free",
    price: "$0",
    description: "For testing CompliPilot with a small workspace.",
    features: [
      "3 members",
      "50 evidence documents",
      "100 MB storage",
      "20 AI analyses per month",
      "Basic compliance workspace",
    ],
  },
  {
    name: "PRO",
    title: "Pro",
    price: "$19",
    description: "For growing teams managing real compliance evidence.",
    highlight: true,
    features: [
      "20 members",
      "1,000 evidence documents",
      "2 GB storage",
      "500 AI analyses per month",
      "Framework templates",
    ],
  },
  {
    name: "BUSINESS",
    title: "Business",
    price: "$99",
    description: "For compliance teams with heavier evidence workflows.",
    features: [
      "50 members",
      "10,000 evidence documents",
      "20 GB storage",
      "5,000 AI analyses per month",
      "Audit-ready reporting roadmap",
    ],
  },
  {
    name: "ENTERPRISE",
    title: "Enterprise",
    price: "Custom",
    description: "For larger organizations with advanced compliance needs.",
    features: [
      "Custom limits",
      "Dedicated support",
      "SSO-ready roadmap",
      "Custom policy packs",
      "Enterprise controls roadmap",
    ],
  },
];

function planTone(plan: SubscriptionPlan) {
  switch (plan) {
    case "FREE":
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    case "PRO":
      return "bg-cyan-50 text-cyan-700 hover:bg-cyan-50";
    case "BUSINESS":
      return "bg-violet-50 text-violet-700 hover:bg-violet-50";
    case "ENTERPRISE":
      return "bg-amber-50 text-amber-700 hover:bg-amber-50";
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
  }
}

function requestStatusTone(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 hover:bg-amber-50";
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
    case "REJECTED":
      return "bg-red-50 text-red-700 hover:bg-red-50";
    case "CANCELLED":
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
  }
}

export default function BillingPage() {
  const { activeOrganization } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const usageQuery = useOrganizationUsageQuery(organizationId);
  const latestPlanChangeRequestQuery =
    useLatestBillingPlanChangeRequestQuery(organizationId);
  const checkoutMutation = useCreateCheckoutSessionMutation(organizationId);

  const [isRequestPlanDialogOpen, setIsRequestPlanDialogOpen] = useState(false);

  const currentPlan = usageQuery.data?.plan;
  const latestPlanChangeRequest = latestPlanChangeRequestQuery.data;
  const hasPendingPlanChangeRequest =
    latestPlanChangeRequest?.status === "PENDING";

  function handlePlanAction(plan: SubscriptionPlan) {
    if (!organizationId) {
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

          setIsRequestPlanDialogOpen(true);
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div className="relative">
          <div className="absolute -right-20 -top-20 size-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Billing
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
                Manage your SaaS plan and workspace usage
              </h2>

              <p className="mt-3 max-w-2xl text-slate-300">
                Track usage limits, compare available plans, and prepare the
                workspace for future subscription upgrades.
              </p>
            </div>

            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
              <WalletCards className="size-6" />
            </div>
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
            Loading billing usage...
          </CardContent>
        </Card>
      ) : usageQuery.data ? (
        <OrganizationUsageCard usage={usageQuery.data} />
      ) : null}

      {latestPlanChangeRequest ? (
        <Card>
          <CardContent className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Latest plan change request
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                {latestPlanChangeRequest.currentPlan} →{" "}
                {latestPlanChangeRequest.requestedPlan}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Requested by {latestPlanChangeRequest.requestedByEmail}
              </p>

              {latestPlanChangeRequest.reviewedByEmail ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Reviewed by {latestPlanChangeRequest.reviewedByEmail}
                </p>
              ) : null}
            </div>

            <Badge
              variant="secondary"
              className={requestStatusTone(latestPlanChangeRequest.status)}
            >
              {latestPlanChangeRequest.status}
            </Badge>
          </CardContent>
        </Card>
      ) : null}

      <section>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Plans
            </p>

            <h3 className="mt-1 text-2xl font-semibold tracking-tight">
              Choose the right plan for your workspace
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              The checkout API is Stripe-ready. Until online checkout is
              connected, plan changes fall back to a platform-admin approval
              request.
            </p>
          </div>

          <Badge variant="secondary" className="w-fit">
            <Sparkles className="mr-2 size-3.5" />
            Stripe-ready checkout placeholder
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.name;
            const isDisabled =
              !organizationId ||
              isCurrentPlan ||
              hasPendingPlanChangeRequest ||
              checkoutMutation.isPending;

            return (
              <Card
                key={plan.name}
                className={
                  isCurrentPlan
                    ? "border-cyan-300 shadow-sm"
                    : plan.highlight
                      ? "border-slate-300"
                      : ""
                }
              >
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-muted-foreground">
                          {plan.title}
                        </p>

                        {plan.highlight ? (
                          <Crown className="size-4 text-cyan-700" />
                        ) : null}
                      </div>

                      <h4 className="mt-2 text-3xl font-bold tracking-tight">
                        {plan.price}
                      </h4>
                    </div>

                    {isCurrentPlan ? (
                      <Badge
                        variant="secondary"
                        className={planTone(plan.name)}
                      >
                        Current
                      </Badge>
                    ) : null}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {plan.description}
                  </p>

                  <div className="mt-5 space-y-3">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-700" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    className="mt-6 w-full"
                    disabled={isDisabled}
                    variant={isCurrentPlan ? "secondary" : "outline"}
                    onClick={() => handlePlanAction(plan.name)}
                  >
                    {checkoutMutation.isPending && !isCurrentPlan ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 size-4" />
                    )}

                    {isCurrentPlan
                      ? "Current plan"
                      : hasPendingPlanChangeRequest
                        ? "Request pending"
                        : checkoutMutation.isPending
                          ? "Preparing checkout..."
                          : "Upgrade / request"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <RequestPlanChangeDialog
        open={isRequestPlanDialogOpen}
        onOpenChange={setIsRequestPlanDialogOpen}
        organizationId={organizationId}
        currentPlan={usageQuery.data?.plan}
      />
    </div>
  );
}

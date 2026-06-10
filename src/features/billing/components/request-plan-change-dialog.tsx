"use client";

import { FormEvent, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBillingPlanChangeRequestMutation } from "@/features/billing/hooks/billing-hooks";
import type { SubscriptionPlan } from "@/lib/api/api-types";
import { Textarea } from "@/components/ui/textarea";

const planOptions: SubscriptionPlan[] = [
  "FREE",
  "PRO",
  "BUSINESS",
  "ENTERPRISE",
];

function planDescription(plan: SubscriptionPlan) {
  switch (plan) {
    case "FREE":
      return "Starter plan for testing and small teams.";
    case "PRO":
      return "Better limits for growing compliance workflows.";
    case "BUSINESS":
      return "Higher limits for teams managing more evidence and AI usage.";
    case "ENTERPRISE":
      return "Custom plan for larger organizations.";
    default:
      return "";
  }
}

export function RequestPlanChangeDialog({
  open,
  onOpenChange,
  organizationId,
  currentPlan,
  initialRequestedPlan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string | undefined;
  currentPlan: SubscriptionPlan | undefined;
  initialRequestedPlan?: SubscriptionPlan;
}) {
  const createRequestMutation =
    useCreateBillingPlanChangeRequestMutation(organizationId);

  const [requestedPlan, setRequestedPlan] = useState<
    SubscriptionPlan | undefined
  >(initialRequestedPlan);

  const [requestNote, setRequestNote] = useState("");

  function resetForm() {
    setRequestedPlan(undefined);
    setRequestNote("");
    createRequestMutation.reset();
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen && !createRequestMutation.isPending) {
      resetForm();
    }
  }

  const availablePlans = planOptions.filter((plan) => plan !== currentPlan);
  const canSubmit =
    Boolean(organizationId) &&
    Boolean(requestedPlan) &&
    requestedPlan !== currentPlan &&
    !createRequestMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!requestedPlan || !canSubmit) {
      return;
    }

    createRequestMutation.mutate(
      {
        requestedPlan,
        requestNote: requestNote.trim() || null,
      },
      {
        onSuccess: () => {
          handleOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-cyan-700" />
            Request plan change
          </DialogTitle>
          <DialogDescription>
            Submit a plan change request. A platform admin will review and
            approve it before the workspace plan changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm font-medium">Reason for request</p>

          <Textarea
            value={requestNote}
            onChange={(event) => setRequestNote(event.target.value)}
            placeholder="Example: We need more storage and AI analyses for monthly compliance reviews."
            maxLength={1000}
            rows={4}
          />

          <p className="text-xs text-muted-foreground">
            Optional. This helps platform admins understand why the workspace
            needs this plan.
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4 text-sm">
          <p className="text-muted-foreground">Current plan</p>
          <div className="mt-2">
            <Badge variant="secondary">{currentPlan ?? "UNKNOWN"}</Badge>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <p className="text-sm font-medium">Requested plan</p>

            <Select
              value={requestedPlan}
              onValueChange={(value) =>
                setRequestedPlan(value as SubscriptionPlan)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>

              <SelectContent>
                {availablePlans.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {requestedPlan ? (
              <p className="text-xs text-muted-foreground">
                {planDescription(requestedPlan)}
              </p>
            ) : null}
          </div>

          {createRequestMutation.error ? (
            <ErrorAlert error={createRequestMutation.error} />
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createRequestMutation.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!canSubmit}>
              {createRequestMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 size-4" />
              )}
              Submit request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

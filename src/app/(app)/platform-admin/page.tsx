"use client";

import { useState } from "react";
import {
  Building2,
  Database,
  HardDrive,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth-hooks";
import {
  usePlatformOrganizationsQuery,
  usePlatformOrganizationUsageQuery,
  usePlatformUsersQuery,
  useUpdatePlatformOrganizationSubscriptionMutation,
} from "@/features/platform-admin/hooks/platform-admin-hooks";
import type {
  PlatformOrganizationResponse,
  SubscriptionPlan,
} from "@/lib/api/api-types";
import { BillingPlanChangeRequestsPanel } from "@/features/platform-admin/components/billing-plan-change-requests-panel";

const planOptions: SubscriptionPlan[] = [
  "FREE",
  "PRO",
  "BUSINESS",
  "ENTERPRISE",
];

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function statusTone(status: string) {
  if (status === "ACTIVE") {
    return "bg-success/10 text-success hover:bg-success/20";
  }

  return "bg-muted text-muted-foreground hover:bg-muted/80";
}

function planTone(plan: string | null) {
  switch (plan) {
    case "PRO":
      return "bg-info/10 text-info hover:bg-info/20";
    case "BUSINESS":
      return "bg-primary/10 text-primary hover:bg-primary/20";
    case "ENTERPRISE":
      return "bg-warning/10 text-warning hover:bg-warning/20";
    case "FREE":
      return "bg-muted text-muted-foreground hover:bg-muted/80";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted/80";
  }
}

function PlatformMetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof Building2;
}) {
  return (
    <Card className="compliance-surface">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PlatformAdminPage() {
  const currentUserQuery = useCurrentUserQuery();

  const organizationsQuery = usePlatformOrganizationsQuery();
  const usersQuery = usePlatformUsersQuery();
  const updateSubscriptionMutation =
    useUpdatePlatformOrganizationSubscriptionMutation();

  const organizations = organizationsQuery.data?.items ?? [];
  const users = usersQuery.data?.items ?? [];

  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | undefined
  >(undefined);

  const selectedOrganization =
    organizations.find(
      (organization) => organization.id === selectedOrganizationId,
    ) ?? organizations[0];

  const organizationUsageQuery = usePlatformOrganizationUsageQuery(
    selectedOrganization?.id,
  );

  const totalStorageBytes = organizations.reduce(
    (total, organization) => total + organization.storageBytes,
    0,
  );

  function handleChangePlan(plan: SubscriptionPlan) {
    if (!selectedOrganization?.id) {
      return;
    }

    updateSubscriptionMutation.mutate({
      organizationId: selectedOrganization.id,
      plan,
    });
  }

  return (
    <div className="space-y-6">
      <section className="compliance-hero">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              Platform Admin
            </p>
            <h2 className="mt-4 max-w-3xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
              Manage CompliPilot SaaS operations
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Review organizations, users, subscriptions, and current usage
              across the platform.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-muted/30 px-5 py-4 backdrop-blur-md">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="mt-1 font-semibold text-foreground">
              {currentUserQuery.data?.email ?? "loading..."}
            </p>
          </div>
        </div>
      </section>

      {organizationsQuery.error ? (
        <ErrorAlert error={organizationsQuery.error} />
      ) : null}

      {usersQuery.error ? <ErrorAlert error={usersQuery.error} /> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PlatformMetricCard
          title="Organizations"
          value={organizationsQuery.data?.totalItems ?? organizations.length}
          description="Total workspaces on the platform"
          icon={Building2}
        />
        <PlatformMetricCard
          title="Users"
          value={usersQuery.data?.totalItems ?? users.length}
          description="Registered platform users"
          icon={Users}
        />
        <PlatformMetricCard
          title="Storage"
          value={formatBytes(totalStorageBytes)}
          description="Current monthly tracked storage"
          icon={HardDrive}
        />
        <PlatformMetricCard
          title="AI usage"
          value={organizations.reduce(
            (total, organization) => total + organization.aiAnalysisCount,
            0,
          )}
          description="AI analyses this month"
          icon={Sparkles}
        />
      </section>

      <BillingPlanChangeRequestsPanel />

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="compliance-surface overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Organizations</h3>
                  <p className="text-sm text-muted-foreground">
                    Platform workspaces and usage overview.
                  </p>
                </div>
              </div>
            </div>

            {organizationsQuery.isLoading ? (
              <div className="flex items-center gap-2 p-5 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading organizations...
              </div>
            ) : organizations.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No organizations found.
              </div>
            ) : (
              <div className="divide-y">
                {organizations.map(
                  (organization: PlatformOrganizationResponse) => {
                    const isSelected =
                      selectedOrganization?.id === organization.id;

                    return (
                      <button
                        key={organization.id}
                        type="button"
                        className={`w-full p-5 text-left transition hover:bg-muted/30 ${
                          isSelected ? "bg-primary/5" : "bg-card"
                        }`}
                        onClick={() =>
                          setSelectedOrganizationId(organization.id)
                        }
                      >
                        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-semibold">
                                {organization.name}
                              </p>
                              <Badge
                                variant="secondary"
                                className={statusTone(organization.status)}
                              >
                                {organization.status}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={planTone(organization.plan)}
                              >
                                {organization.plan ?? "NO_PLAN"}
                              </Badge>
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                              /{organization.slug}
                            </p>

                            <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
                              <span>
                                {organization.activeMemberCount} members
                              </span>
                              <span>
                                {organization.evidenceDocumentCount} evidence
                              </span>
                              <span>
                                {formatBytes(organization.storageBytes)}
                              </span>
                              <span>
                                {organization.aiAnalysisCount} AI runs
                              </span>
                            </div>
                          </div>

                          <span className="text-xs text-muted-foreground">
                            Created {formatDate(organization.createdAt)}
                          </span>
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="compliance-surface">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Database className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Selected usage</h3>
                  <p className="text-sm text-muted-foreground">
                    Plan and quota details.
                  </p>
                </div>
              </div>

              {!selectedOrganization ? (
                <p className="mt-5 text-sm text-muted-foreground">
                  Select an organization to view usage.
                </p>
              ) : organizationUsageQuery.isLoading ? (
                <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading usage...
                </div>
              ) : organizationUsageQuery.error ? (
                <div className="mt-5">
                  <ErrorAlert error={organizationUsageQuery.error} />
                </div>
              ) : organizationUsageQuery.data ? (
                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Plan</span>
                    <Badge
                      variant="secondary"
                      className={planTone(organizationUsageQuery.data.plan)}
                    >
                      {organizationUsageQuery.data.plan}
                    </Badge>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-border/50 bg-muted/30 p-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      Change plan
                    </p>

                    <Select
                      value={organizationUsageQuery.data.plan}
                      disabled={updateSubscriptionMutation.isPending}
                      onValueChange={(plan) =>
                        handleChangePlan(plan as SubscriptionPlan)
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {planOptions.map((plan) => (
                          <SelectItem key={plan} value={plan}>
                            {plan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <p className="text-xs text-muted-foreground">
                      This is a manual platform-admin override. Billing checkout
                      can be connected later.
                    </p>
                  </div>

                  {updateSubscriptionMutation.error ? (
                    <ErrorAlert error={updateSubscriptionMutation.error} />
                  ) : null}

                  {updateSubscriptionMutation.isPending ? (
                    <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-3 py-2 text-xs text-primary">
                      <Loader2 className="size-3.5 animate-spin" />
                      Updating subscription plan...
                    </div>
                  ) : null}

                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Members</span>
                    <span>
                      {organizationUsageQuery.data.memberCount} /{" "}
                      {organizationUsageQuery.data.memberLimit}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Evidence</span>
                    <span>
                      {organizationUsageQuery.data.evidenceDocumentCount} /{" "}
                      {organizationUsageQuery.data.evidenceDocumentLimit}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Storage</span>
                    <span>
                      {formatBytes(
                        organizationUsageQuery.data.storageUsedBytes,
                      )}{" "}
                      /{" "}
                      {formatBytes(
                        organizationUsageQuery.data.storageLimitBytes,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">AI analyses</span>
                    <span>
                      {organizationUsageQuery.data.aiAnalysisCountThisMonth} /{" "}
                      {organizationUsageQuery.data.aiAnalysisLimitPerMonth}
                    </span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="compliance-surface">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Users className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Recent users</h3>
                  <p className="text-sm text-muted-foreground">
                    Latest registered users.
                  </p>
                </div>
              </div>

              {usersQuery.isLoading ? (
                <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <p className="mt-5 text-sm text-muted-foreground">
                  No users found.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {users.slice(0, 8).map((user) => (
                    <div
                      key={user.id}
                      className="rounded-2xl border border-border/50 bg-muted/30 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {user.fullName}
                          </p>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>

                        <Badge
                          variant="secondary"
                          className={statusTone(user.status)}
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

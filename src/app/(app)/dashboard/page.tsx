"use client";

import { Activity, ClipboardCheck, FileCheck2, ListChecks } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCurrentUserQuery,
  useMyOrganizationsQuery,
} from "@/features/auth/hooks/auth-hooks";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

const summaryCards = [
  {
    title: "Controls",
    value: "5",
    description: "Baseline requirements seeded",
    icon: ClipboardCheck,
  },
  {
    title: "Evidence",
    value: "Ready",
    description: "Upload and link evidence",
    icon: FileCheck2,
  },
  {
    title: "Tasks",
    value: "Track",
    description: "Owners, due dates, priorities",
    icon: ListChecks,
  },
  {
    title: "Audit",
    value: "Live",
    description: "Actions recorded by organization",
    icon: Activity,
  },
];

export default function DashboardPage() {
  const currentUserQuery = useCurrentUserQuery();
  const organizationsQuery = useMyOrganizationsQuery();
  const { activeOrganization, canManageCompliance } = useActiveOrganization();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Badge className="bg-cyan-300/15 text-cyan-200 hover:bg-cyan-300/15">
              MVP workspace
            </Badge>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
              Welcome back, {currentUserQuery.data?.fullName ?? "compliance lead"}.
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              This workspace is ready for compliance controls, evidence linking,
              task management, and audit trail reviews.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-sm text-slate-400">Active organization</p>
            <p className="mt-1 text-lg font-semibold">
              {activeOrganization?.organizationName ?? "Loading..."}
            </p>
            <p className="mt-1 text-sm text-cyan-200">
              {activeOrganization?.role ?? "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="size-5 text-cyan-700" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Implementation status</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              "Cookie-based auth storage",
              "TanStack Query server state",
              "Workspace selector with cookie persistence",
              "Protected app shell",
              "Backend contract v0.9 ready",
            ].map((item) => (
              <div
                className="flex items-center justify-between rounded-2xl border bg-slate-50 p-4"
                key={item}
              >
                <span className="font-medium">{item}</span>
                <Badge variant="secondary">Done</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">User</p>
              <p className="font-medium">
                {currentUserQuery.data?.email ?? "Loading..."}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Organizations loaded</p>
              <p className="font-medium">
                {organizationsQuery.data?.length ?? 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Can manage compliance</p>
              <p className="font-medium">{canManageCompliance ? "Yes" : "No"}</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
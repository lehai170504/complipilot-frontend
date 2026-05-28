"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCurrentUserQuery,
  useLogoutMutation,
  useMyOrganizationsQuery,
} from "@/features/auth/hooks/auth-hooks";

export default function DashboardPage() {
  const currentUserQuery = useCurrentUserQuery();
  const organizationsQuery = useMyOrganizationsQuery();
  const logoutMutation = useLogoutMutation();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-4 rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              CompliPilot
            </p>
            <h1 className="mt-2 text-3xl font-bold">Compliance Workspace</h1>
            <p className="mt-2 text-slate-300">
              Frontend foundation connected with cookie auth and TanStack Query.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </header>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current user</CardTitle>
            </CardHeader>
            <CardContent>
              {currentUserQuery.isLoading ? (
                <p className="text-slate-500">Loading user...</p>
              ) : currentUserQuery.error ? (
                <p className="text-red-600">Unable to load user.</p>
              ) : (
                <div>
                  <p className="text-xl font-semibold">
                    {currentUserQuery.data?.fullName}
                  </p>
                  <p className="mt-1 text-slate-600">
                    {currentUserQuery.data?.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              {organizationsQuery.isLoading ? (
                <p className="text-slate-500">Loading organizations...</p>
              ) : organizationsQuery.error ? (
                <p className="text-red-600">Unable to load organizations.</p>
              ) : (
                <div className="space-y-3">
                  {organizationsQuery.data?.map((organization) => (
                    <div
                      className="rounded-2xl border bg-slate-50 p-4"
                      key={organization.organizationId}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">
                          {organization.organizationName}
                        </p>
                        <Badge>{organization.role}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {organization.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
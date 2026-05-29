"use client";

import { Building2, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

export default function WorkspacesPage() {
  const {
    activeOrganization,
    organizations,
    isLoading,
    changeActiveOrganization,
  } = useActiveOrganization();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Workspaces
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
            Your organizations and workspaces.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Switch between organizations to manage compliance across different workspaces.
          </p>
        </div>
      </section>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-muted-foreground">
            Loading workspaces...
          </CardContent>
        </Card>
      ) : organizations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="rounded-3xl bg-slate-950 p-4 text-cyan-300">
              <Building2 className="size-8" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">No workspaces yet</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              You are not a member of any organization yet. Create an account or ask an admin for an invitation.
            </p>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-4">
          {organizations.map((org) => {
            const isActive =
              activeOrganization?.organizationId === org.organizationId;

            return (
              <Card
                key={org.organizationId}
                className={`overflow-hidden transition-all ${
                  isActive ? "ring-2 ring-cyan-300" : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex size-12 items-center justify-center rounded-2xl ${
                          isActive
                            ? "bg-slate-950 text-cyan-300"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isActive ? (
                          <ShieldCheck className="size-6" />
                        ) : (
                          <Building2 className="size-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight">
                          {org.organizationName}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            className={
                              org.role === "OWNER"
                                ? "bg-cyan-50 text-cyan-700 hover:bg-cyan-50"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                            }
                            variant="secondary"
                          >
                            {org.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {org.status}
                          </span>
                          {isActive ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              Active
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {!isActive ? (
                      <Button
                        onClick={() => changeActiveOrganization(org.organizationId)}
                        variant="outline"
                      >
                        Switch to this workspace
                      </Button>
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                        Current workspace
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
}

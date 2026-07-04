"use client";

import { Building2, ShieldCheck, ArrowRightLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrganizationMembersPanel } from "@/features/organizations/components/organization-members-panel";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";

export default function WorkspacesPage() {
  const {
    activeOrganization,
    organizations,
    isLoading,
    changeActiveOrganization,
    canManageMembers,
  } = useActiveOrganization();

  const t = useTranslations("workspacesPage");
  const tStatus = useTranslations("status");

  return (
    <div className="compliance-page-shell">
      <section className="compliance-hero">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
            {t("heroEyebrow")}
          </p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            {t("heroTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      {isLoading ? (
        <Card className="compliance-surface">
          <CardContent className="p-8 text-muted-foreground">
            {t("loading")}
          </CardContent>
        </Card>
      ) : organizations.length === 0 ? (
        <Card className="compliance-surface">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="rounded-3xl bg-primary/10 p-4 text-primary">
              <Building2 className="size-8" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">{t("emptyTitle")}</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              {t("emptyDescription")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
          <section className="flex flex-col gap-4">
            {organizations.map((org) => {
              const isActive =
                activeOrganization?.organizationId === org.organizationId;

              return (
                <Card
                  key={org.organizationId}
                  onClick={() => {
                    if (!isActive) {
                      changeActiveOrganization(org.organizationId);
                    }
                  }}
                  className={`group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isActive ? "ring-2 ring-primary" : "cursor-pointer"
                    }`}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${isActive
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                            : "bg-muted text-muted-foreground"
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
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <Badge
                              className={
                                org.role === "OWNER"
                                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                                  : "bg-muted text-muted-foreground hover:bg-muted"
                              }
                              variant="secondary"
                            >
                              {tStatus(org.role)}
                            </Badge>

                            <span className="text-xs text-muted-foreground">
                              {tStatus(org.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!isActive ? (
                        <div
                          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-primary/5 group-hover:text-primary ml-4"
                          title={t("switch")}
                        >
                          <ArrowRightLeft className="size-4" />
                        </div>
                      ) : (
                        <Badge className="bg-success/10 text-success hover:bg-success/20 shrink-0 ml-4">
                          {t("current")}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <div className="flex flex-col gap-4">
            <OrganizationMembersPanel
              organizationId={activeOrganization?.organizationId}
              canManageMembers={canManageMembers}
            />
          </div>
        </div>
      )}
    </div>
  );
}

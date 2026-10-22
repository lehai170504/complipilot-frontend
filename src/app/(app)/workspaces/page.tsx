"use client";

import { Building2, ShieldCheck, ArrowRightLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { ManagementPageHeader } from "@/components/layout/management-page-header";
import { Badge } from "@/components/ui/badge";
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
      <ManagementPageHeader
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        description={t("heroDescription")}
        icon={Building2}
      />

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
                  className={`group overflow-hidden transition-colors ${
                    isActive
                      ? "border-primary/40 bg-primary/[0.03] ring-1 ring-primary/15"
                      : "hover:border-primary/25"
                  }`}
                >
                  <CardContent className="p-0">
                    <button
                      aria-current={isActive ? "true" : undefined}
                      aria-pressed={isActive}
                      className="flex min-h-24 w-full items-center justify-between gap-3 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:p-5"
                      onClick={() => {
                        if (!isActive) {
                          changeActiveOrganization(org.organizationId);
                        }
                      }}
                      type="button"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${isActive
                            ? "bg-primary text-primary-foreground"
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
                          <h3 className="break-words text-base font-semibold tracking-tight sm:text-lg">
                            {org.organizationName}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <Badge
                              className={
                                org.role === "OWNER"
                                  ? "bg-primary/10 text-primary hover:bg-primary/10"
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
                          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                          title={t("switch")}
                        >
                          <ArrowRightLeft className="size-4" />
                        </div>
                      ) : (
                        <Badge className="shrink-0 bg-success/10 text-success hover:bg-success/10">
                          {t("current")}
                        </Badge>
                      )}
                    </button>
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

"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Database,
  Loader2,
  Mail,
  ServerCog,
  Sparkles,
  XCircle,
} from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSystemStatusQuery } from "@/features/system/hooks/system-status-hooks";
import type {
  SystemComponentStatus,
  SystemStatusComponentResponse,
} from "@/lib/api/api-types";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusTone(status: SystemComponentStatus) {
  switch (status) {
    case "UP":
      return "bg-success/10 text-success hover:bg-success/20";
    case "WARN":
      return "bg-warning/10 text-warning hover:bg-warning/20";
    case "DOWN":
      return "bg-destructive/10 text-destructive hover:bg-destructive/20";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted/80";
  }
}

function StatusIcon({ status }: { status: SystemComponentStatus }) {
  if (status === "UP") {
    return <CheckCircle2 className="size-5 text-success" />;
  }

  if (status === "WARN") {
    return <AlertTriangle className="size-5 text-warning" />;
  }

  return <XCircle className="size-5 text-destructive" />;
}

function renderComponentIcon(key: string) {
  switch (key) {
    case "database":
      return <Database className="size-5" />;
    case "ai":
      return <Sparkles className="size-5" />;
    case "mail":
      return <Mail className="size-5" />;
    case "billing":
      return <CreditCard className="size-5" />;
    default:
      return <ServerCog className="size-5" />;
  }
}

function safeDetailValue(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (value === null || value === undefined) {
    return "—";
  }

  return String(value);
}

function SystemComponentCard({
  component,
}: {
  component: SystemStatusComponentResponse;
}) {
  const details = Object.entries(component.details ?? {});
  return (
    <Card className="compliance-surface">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {renderComponentIcon(component.key)}
            </div>

            <div>
              <h3 className="font-semibold">{component.label}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {component.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusIcon status={component.status} />
            <Badge variant="secondary" className={statusTone(component.status)}>
              {component.status}
            </Badge>
          </div>
        </div>

        {details.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {details.map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {key}
                </p>
                <p className="mt-1 break-all text-sm font-semibold text-foreground">
                  {safeDetailValue(value)}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function SystemStatusPage() {
  const statusQuery = useSystemStatusQuery();
  const status = statusQuery.data;

  return (
    <div className="space-y-6">
      <section className="compliance-hero">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              System Status
            </p>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              Monitor CompliPilot operational health
            </h2>

            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Review backend, database, storage, AI, and mail configuration
              health from one internal dashboard.
            </p>
          </div>

          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Activity className="size-6" />
          </div>
        </div>
      </section>

      {statusQuery.error ? <ErrorAlert error={statusQuery.error} /> : null}

      {statusQuery.isLoading ? (
        <Card className="compliance-surface">
          <CardContent className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading system status...
          </CardContent>
        </Card>
      ) : status ? (
        <>
          <Card className="compliance-surface">
            <CardContent className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Overall status
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusIcon status={status.status} />
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {status.status}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={statusTone(status.status)}
                  >
                    {status.service}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-2xl border border-border/50 bg-muted/30 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Version
                  </p>
                  <p className="mt-1 font-semibold text-foreground">{status.version}</p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-muted/30 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Checked at
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {formatDateTime(status.timestamp)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="grid gap-6 xl:grid-cols-2">
            {status.components.map((component) => (
              <SystemComponentCard key={component.key} component={component} />
            ))}
          </section>
        </>
      ) : null}
    </div>
  );
}

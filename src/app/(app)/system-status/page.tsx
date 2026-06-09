"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
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
      return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
    case "WARN":
      return "bg-amber-50 text-amber-700 hover:bg-amber-50";
    case "DOWN":
      return "bg-red-50 text-red-700 hover:bg-red-50";
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
  }
}

function StatusIcon({ status }: { status: SystemComponentStatus }) {
  if (status === "UP") {
    return <CheckCircle2 className="size-5 text-emerald-600" />;
  }

  if (status === "WARN") {
    return <AlertTriangle className="size-5 text-amber-600" />;
  }

  return <XCircle className="size-5 text-red-600" />;
}

function renderComponentIcon(key: string) {
  switch (key) {
    case "database":
      return <Database className="size-5" />;
    case "ai":
      return <Sparkles className="size-5" />;
    case "mail":
      return <Mail className="size-5" />;
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
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
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
              <div key={key} className="rounded-2xl border bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {key}
                </p>
                <p className="mt-1 break-all text-sm font-semibold">
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
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div className="relative">
          <div className="absolute -right-20 -top-20 size-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
                System Status
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
                Monitor CompliPilot operational health
              </h2>

              <p className="mt-3 max-w-2xl text-slate-300">
                Review backend, database, storage, AI, and mail configuration
                health from one internal dashboard.
              </p>
            </div>

            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
              <Activity className="size-6" />
            </div>
          </div>
        </div>
      </section>

      {statusQuery.error ? <ErrorAlert error={statusQuery.error} /> : null}

      {statusQuery.isLoading ? (
        <Card>
          <CardContent className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading system status...
          </CardContent>
        </Card>
      ) : status ? (
        <>
          <Card>
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
                <div className="rounded-2xl border bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Version
                  </p>
                  <p className="mt-1 font-semibold">{status.version}</p>
                </div>

                <div className="rounded-2xl border bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Checked at
                  </p>
                  <p className="mt-1 font-semibold">
                    {formatDateTime(status.timestamp)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="grid gap-4">
            {status.components.map((component) => (
              <SystemComponentCard key={component.key} component={component} />
            ))}
          </section>
        </>
      ) : null}
    </div>
  );
}

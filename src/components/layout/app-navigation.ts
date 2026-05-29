import {
  Building2,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  ListChecks,
  ScrollText,
} from "lucide-react";

export const appNavigationItems = [
  {
    labelKey: "dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    labelKey: "compliance",
    href: "/compliance",
    icon: ClipboardCheck,
  },
  {
    labelKey: "evidence",
    href: "/evidence",
    icon: FileCheck2,
  },
  {
    labelKey: "tasks",
    href: "/tasks",
    icon: ListChecks,
  },
  {
    labelKey: "audit",
    href: "/audit",
    icon: ScrollText,
  },
  {
    labelKey: "workspaces",
    href: "/workspaces",
    icon: Building2,
  },
] as const;
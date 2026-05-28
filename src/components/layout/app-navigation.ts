import {
  ClipboardCheck,
  FileCheck2,
  Gauge,
  ListChecks,
  ScrollText,
} from "lucide-react";

export const appNavigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    title: "Compliance",
    href: "/compliance",
    icon: ClipboardCheck,
  },
  {
    title: "Evidence",
    href: "/evidence",
    icon: FileCheck2,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: ListChecks,
  },
  {
    title: "Audit",
    href: "/audit",
    icon: ScrollText,
  },
] as const;
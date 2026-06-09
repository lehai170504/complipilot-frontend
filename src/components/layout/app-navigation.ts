import {
  Building2,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  Gauge,
  ListChecks,
  ScrollText,
  ServerCog,
  Settings,
  Shield,
  UserCircle,
} from "lucide-react";

export type AppNavigationPermission =
  | "all"
  | "canViewAudit"
  | "canViewPlatformAdmin";

export const appNavigationItems = [
  {
    labelKey: "dashboard",
    href: "/dashboard",
    icon: Gauge,
    permission: "all",
  },
  {
    labelKey: "compliance",
    href: "/compliance",
    icon: ClipboardCheck,
    permission: "all",
  },
  {
    labelKey: "evidence",
    href: "/evidence",
    icon: FileCheck2,
    permission: "all",
  },
  {
    labelKey: "tasks",
    href: "/tasks",
    icon: ListChecks,
    permission: "all",
  },
  {
    labelKey: "billing",
    href: "/billing",
    icon: CreditCard,
    permission: "all",
  },
  {
    labelKey: "settings",
    href: "/settings",
    icon: Settings,
    permission: "all",
  },
  {
    labelKey: "profile",
    href: "/profile",
    icon: UserCircle,
    permission: "all",
  },
  {
    labelKey: "audit",
    href: "/audit",
    icon: ScrollText,
    permission: "canViewAudit",
  },
  {
    labelKey: "platformAdmin",
    href: "/platform-admin",
    icon: Shield,
    permission: "canViewPlatformAdmin",
  },
  {
    labelKey: "workspaces",
    href: "/workspaces",
    icon: Building2,
    permission: "all",
  },
  {
    labelKey: "systemStatus",
    href: "/system-status",
    icon: ServerCog,
    permission: "canViewPlatformAdmin",
  },
] as const;

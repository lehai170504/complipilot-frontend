import {
  Building2,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  Gauge,
  ListChecks,
  ScrollText,
  ServerCog,
  Shield,
  type LucideIcon,
} from "lucide-react";

export type AppNavigationPermission =
  | "all"
  | "canViewAudit"
  | "canManageBilling"
  | "canViewPlatformAdmin";

export type NavigationItem = {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  permission: AppNavigationPermission;
};

export type NavigationGroup = {
  groupLabelKey?: string;
  items: NavigationItem[];
};

export const appNavigationGroups: NavigationGroup[] = [
  {
    groupLabelKey: "overview",
    items: [
      {
        labelKey: "dashboard",
        href: "/dashboard",
        icon: Gauge,
        permission: "all",
      },
      {
        labelKey: "tasks",
        href: "/tasks",
        icon: ListChecks,
        permission: "all",
      },
    ],
  },
  {
    groupLabelKey: "workspace",
    items: [
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
    ],
  },
  {
    groupLabelKey: "management",
    items: [
      {
        labelKey: "workspaces",
        href: "/workspaces",
        icon: Building2,
        permission: "all",
      },
      {
        labelKey: "billing",
        href: "/billing",
        icon: CreditCard,
        permission: "canManageBilling",
      },
      {
        labelKey: "audit",
        href: "/audit",
        icon: ScrollText,
        permission: "canViewAudit",
      },
    ],
  },
  {
    groupLabelKey: "platform",
    items: [
      {
        labelKey: "platformAdmin",
        href: "/platform-admin",
        icon: Shield,
        permission: "canViewPlatformAdmin",
      },
      {
        labelKey: "systemStatus",
        href: "/system-status",
        icon: ServerCog,
        permission: "canViewPlatformAdmin",
      },
    ],
  },
];

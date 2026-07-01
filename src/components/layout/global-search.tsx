"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Activity,
  Building2,
  FileCheck2,
  ListChecks,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useActiveOrganization } from "@/features/organizations/hooks/organization-hooks";
import { useGlobalSearchQuery } from "@/features/search/hooks/search-hooks";
import { Loader2 } from "lucide-react";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const t = useTranslations("navigation");
  const tTopbar = useTranslations("topbar");

  const { activeOrganization } = useActiveOrganization();
  const organizationId = activeOrganization?.organizationId;

  const searchQuery = useGlobalSearchQuery(organizationId, query);
  const searchResults = searchQuery.data;
  const isSearching = searchQuery.isFetching;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    setQuery("");
    command();
  };

  const modules = [
    { label: t("dashboard"), icon: Activity, path: "/dashboard" },
    { label: t("compliance"), icon: ShieldCheck, path: "/compliance" },
    { label: t("evidence"), icon: FileCheck2, path: "/evidence" },
    { label: t("tasks"), icon: ListChecks, path: "/tasks" },
    { label: t("audit"), icon: ScrollText, path: "/audit" },
  ];

  const management = [
    { label: t("workspaces"), icon: Building2, path: "/workspaces" },
    { label: t("settings"), icon: Settings, path: "/settings" },
    { label: t("profile"), icon: User, path: "/profile" },
  ];

  const filteredModules = useMemo(() => {
    if (!query) return modules;
    return modules.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, t]);

  const filteredManagement = useMemo(() => {
    if (!query) return management;
    return management.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, t]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden max-w-sm flex-1 items-center rounded-2xl border border-border/80 bg-muted/50 px-3 py-2 text-sm text-muted-foreground shadow-inner transition-all hover:bg-muted focus-within:border-primary focus-within:bg-background focus-within:shadow-md focus-within:shadow-primary/10 dark:hover:bg-muted/80 md:flex"
      >
        <Search className="mr-2 size-4 text-muted-foreground" />
        <span className="opacity-80 flex-1 text-left">
          {tTopbar("searchPlaceholder")}
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-[425px] outline-none" showCloseButton={false}>
          <DialogTitle className="sr-only">Global Search</DialogTitle>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 size-4 shrink-0 opacity-50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tTopbar("searchPlaceholder")}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto overflow-x-hidden p-1">
            {isSearching && (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                {tTopbar("loadingUser")}
              </div>
            )}

            {!isSearching &&
              filteredModules.length === 0 &&
              filteredManagement.length === 0 &&
              (!searchResults ||
                (searchResults.complianceItems.length === 0 &&
                  searchResults.evidence.length === 0 &&
                  searchResults.tasks.length === 0 &&
                  searchResults.auditEvents.length === 0)) && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {tTopbar("noResults")}
                </div>
              )}

            {!isSearching && searchResults && searchResults.complianceItems.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {t("compliance")}
                </div>
                {searchResults.complianceItems.map((item) => (
                  <button
                    key={item.id}
                    className="relative flex w-full flex-col items-start cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => runCommand(() => router.push(item.url))}
                  >
                    <div className="flex items-center font-medium">
                      <ShieldCheck className="mr-2 size-4 text-primary" />
                      {item.title}
                    </div>
                    {item.description && (
                      <span className="ml-6 line-clamp-1 text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </button>
                ))}
                <div className="my-1 h-px bg-border" />
              </>
            )}

            {!isSearching && searchResults && searchResults.evidence.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {t("evidence")}
                </div>
                {searchResults.evidence.map((item) => (
                  <button
                    key={item.id}
                    className="relative flex w-full flex-col items-start cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => runCommand(() => router.push(item.url))}
                  >
                    <div className="flex items-center font-medium">
                      <FileCheck2 className="mr-2 size-4 text-primary" />
                      {item.title}
                    </div>
                    {item.description && (
                      <span className="ml-6 line-clamp-1 text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </button>
                ))}
                <div className="my-1 h-px bg-border" />
              </>
            )}

            {!isSearching && searchResults && searchResults.tasks.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {t("tasks")}
                </div>
                {searchResults.tasks.map((item) => (
                  <button
                    key={item.id}
                    className="relative flex w-full flex-col items-start cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => runCommand(() => router.push(item.url))}
                  >
                    <div className="flex items-center font-medium">
                      <ListChecks className="mr-2 size-4 text-primary" />
                      {item.title}
                    </div>
                    {item.description && (
                      <span className="ml-6 line-clamp-1 text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </button>
                ))}
                <div className="my-1 h-px bg-border" />
              </>
            )}

            {!isSearching && searchResults && searchResults.auditEvents.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {t("audit")}
                </div>
                {searchResults.auditEvents.map((item) => (
                  <button
                    key={item.id}
                    className="relative flex w-full flex-col items-start cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => runCommand(() => router.push(item.url))}
                  >
                    <div className="flex items-center font-medium">
                      <ScrollText className="mr-2 size-4 text-primary" />
                      {item.title}
                    </div>
                    {item.description && (
                      <span className="ml-6 line-clamp-1 text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </button>
                ))}
                <div className="my-1 h-px bg-border" />
              </>
            )}

            {!isSearching && filteredModules.length > 0 && (
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                {tTopbar("modules")}
              </div>
            )}
            {filteredModules.map((item) => (
              <button
                key={item.path}
                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => runCommand(() => router.push(item.path))}
              >
                <item.icon className="mr-2 size-4" />
                <span>{item.label}</span>
              </button>
            ))}

            {filteredModules.length > 0 && filteredManagement.length > 0 && (
              <div className="my-1 h-px bg-border" />
            )}

            {filteredManagement.length > 0 && (
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                {tTopbar("management")}
              </div>
            )}
            {filteredManagement.map((item) => (
              <button
                key={item.path}
                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => runCommand(() => router.push(item.path))}
              >
                <item.icon className="mr-2 size-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

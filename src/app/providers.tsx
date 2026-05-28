"use client";

import { AppQueryProvider } from "@/lib/query/query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppQueryProvider>{children}</AppQueryProvider>;
}
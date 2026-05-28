import { FileQuestion } from "lucide-react";

export function DashboardEmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-slate-50 p-8 text-center">
      <div className="rounded-2xl bg-white p-3 text-slate-400 shadow-sm">
        <FileQuestion className="size-5" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
import { ShieldCheck } from "lucide-react";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-inner shadow-primary/20">
        <ShieldCheck className="size-6" />
      </div>
      <div>
        <p className="text-lg font-bold tracking-tight text-foreground">CompliPilot</p>
        <p className="text-xs text-muted-foreground font-medium">AI Compliance & Evidence OS</p>
      </div>
    </div>
  );
}
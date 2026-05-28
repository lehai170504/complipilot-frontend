import { ShieldCheck } from "lucide-react";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20">
        <ShieldCheck className="size-6" />
      </div>
      <div>
        <p className="text-lg font-bold tracking-tight text-white">CompliPilot</p>
        <p className="text-xs text-slate-400">AI Compliance & Evidence OS</p>
      </div>
    </div>
  );
}
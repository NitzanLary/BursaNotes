"use client";

import { BarChart3, LineChart as LineIcon } from "lucide-react";
import type { VisualArtifactData } from "@/lib/types";
import { Sparkline } from "./Sparkline";

export function InlineChart({ artifact }: { artifact: VisualArtifactData }) {
  const Icon = artifact.chartType === "bar" ? BarChart3 : LineIcon;

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden max-w-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30 text-xs font-medium">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {artifact.title}
      </div>
      <div className="p-3">
        <Sparkline
          series={artifact.series}
          xLabels={artifact.xLabels}
          chartType={artifact.chartType}
          height={140}
        />
      </div>
    </div>
  );
}

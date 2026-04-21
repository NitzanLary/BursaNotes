"use client";

import { BarChart3, FileText, Layers, Table } from "lucide-react";

const COPY: Record<
  "table" | "text" | "visual" | "all",
  { icon: typeof Table; title: string; body: string }
> = {
  table: {
    icon: Table,
    title: "No tables yet",
    body: "Ask a question that produces tabular data — segment breakdowns, peer comps, or P&L views.",
  },
  text: {
    icon: FileText,
    title: "No text artifacts yet",
    body: "Ask for a thesis draft, team summary, or bull/bear memo to populate this tab.",
  },
  visual: {
    icon: BarChart3,
    title: "No visuals yet",
    body: "Ask about trends, trajectories, or mix over time and a chart will appear here.",
  },
  all: {
    icon: Layers,
    title: "Nothing produced yet",
    body: "Start a conversation — every table, chart, and memo you generate will collect here.",
  },
};

export function EmptyArtifactState({ kind }: { kind: keyof typeof COPY }) {
  const c = COPY[kind];
  const Icon = c.icon;
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-xs space-y-2">
        <div className="mx-auto h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-sm font-medium">{c.title}</div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          {c.body}
        </div>
      </div>
    </div>
  );
}

"use client";

import { LayoutDashboard, Table, FileText, BarChart3, Layers } from "lucide-react";
import { useActiveTickerState, useWorkspace, type ArtifactTab } from "@/lib/store/workspace-store";
import { cn } from "@/lib/utils";
import { OverviewTab } from "./OverviewTab";
import { ArtifactList } from "./ArtifactList";

const TABS: { id: ArtifactTab; label: string; icon: typeof Layers }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tables", label: "Tables", icon: Table },
  { id: "text", label: "Text", icon: FileText },
  { id: "visuals", label: "Visuals", icon: BarChart3 },
  { id: "all", label: "All", icon: Layers },
];

export function ArtifactsPane() {
  const ticker = useActiveTickerState();
  const setArtifactTab = useWorkspace((s) => s.setArtifactTab);
  if (!ticker) return null;

  const countFor = (id: ArtifactTab) => {
    if (id === "overview") return null;
    if (id === "all") return ticker.artifacts.length;
    if (id === "tables") return ticker.artifacts.filter((a) => a.kind === "table").length;
    if (id === "text") return ticker.artifacts.filter((a) => a.kind === "text").length;
    if (id === "visuals") return ticker.artifacts.filter((a) => a.kind === "visual").length;
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-sidebar">
      <div className="flex items-center justify-between px-4 h-11 border-b border-border/60">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Artifacts
        </span>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {ticker.artifacts.length} total
        </span>
      </div>

      <div className="flex items-center gap-0.5 px-2 pt-2 pb-1 border-b border-border/60 overflow-x-auto">
        {TABS.map((t) => {
          const active = ticker.activeArtifactTab === t.id;
          const count = countFor(t.id);
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setArtifactTab(ticker.symbol, t.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition shrink-0",
                active
                  ? "bg-surface text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {count !== null && count > 0 && (
                <span
                  className={cn(
                    "ml-0.5 px-1 min-w-[16px] h-[16px] rounded-full text-[9px] tabular-nums flex items-center justify-center",
                    active
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        {ticker.activeArtifactTab === "overview" && <OverviewTab ticker={ticker.symbol} />}
        {ticker.activeArtifactTab === "tables" && (
          <ArtifactList
            artifacts={ticker.artifacts.filter((a) => a.kind === "table")}
            pulseId={ticker.pulseArtifactId}
            emptyKind="table"
          />
        )}
        {ticker.activeArtifactTab === "text" && (
          <ArtifactList
            artifacts={ticker.artifacts.filter((a) => a.kind === "text")}
            pulseId={ticker.pulseArtifactId}
            emptyKind="text"
          />
        )}
        {ticker.activeArtifactTab === "visuals" && (
          <ArtifactList
            artifacts={ticker.artifacts.filter((a) => a.kind === "visual")}
            pulseId={ticker.pulseArtifactId}
            emptyKind="visual"
          />
        )}
        {ticker.activeArtifactTab === "all" && (
          <ArtifactList artifacts={ticker.artifacts} pulseId={ticker.pulseArtifactId} emptyKind="all" />
        )}
      </div>
    </div>
  );
}

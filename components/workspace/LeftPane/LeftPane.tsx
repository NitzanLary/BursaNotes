"use client";

import { useActiveTickerState, useWorkspace } from "@/lib/store/workspace-store";
import { SourceList } from "./SourceList";
import { SourceViewer } from "./SourceViewer";
import { ProcessingSkeleton } from "./ProcessingSkeleton";

export function LeftPane() {
  const ticker = useActiveTickerState();
  const activeTicker = useWorkspace((s) => s.activeTicker);

  if (!ticker || !activeTicker) return null;

  if (ticker.pinnedSourceId) {
    return <SourceViewer tickerState={ticker} />;
  }

  if (!ticker.processingDone) {
    return <ProcessingSkeleton />;
  }

  return <SourceList tickerState={ticker} />;
}

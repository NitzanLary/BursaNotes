"use client";

import type { Citation } from "@/lib/types";
import { useWorkspace, type TickerState } from "@/lib/store/workspace-store";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function CitationChip({
  label,
  citation,
  tickerState,
}: {
  label: string;
  citation: Citation;
  tickerState: TickerState;
}) {
  const pinSource = useWorkspace((s) => s.pinSource);
  const source = tickerState.sources.find((s) => s.id === citation.sourceId);
  const passage = source?.passages.find((p) => p.id === citation.passageId);

  const snippet = passage?.text ?? "Source not available.";
  const shortTitle = source?.title ?? "Unknown source";

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <button
            onClick={() =>
              pinSource(tickerState.symbol, citation.sourceId, citation.passageId)
            }
            className="inline-flex items-center justify-center align-baseline mx-0.5 px-1.5 h-[18px] text-[11px] font-medium leading-none rounded-full bg-citation-soft text-primary hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
          >
            {label}
          </button>
        }
      />
      <HoverCardContent className="w-80 text-xs">
        <div className="font-medium text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
          {shortTitle}
        </div>
        <div className="text-[12px] leading-relaxed text-foreground/90 line-clamp-5">
          “{snippet}”
        </div>
        <div className="mt-2 pt-2 border-t border-border text-[10px] text-muted-foreground">
          Click to open in sidebar
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

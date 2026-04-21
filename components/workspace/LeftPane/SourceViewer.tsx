"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace, type TickerState } from "@/lib/store/workspace-store";
import { Button } from "@/components/ui/button";

export function SourceViewer({ tickerState }: { tickerState: TickerState }) {
  const { symbol, pinnedSourceId, highlightedPassageId } = tickerState;
  const clearPin = useWorkspace((s) => s.clearPin);
  const highlightRef = useRef<HTMLDivElement>(null);

  const source = tickerState.sources.find((s) => s.id === pinnedSourceId);

  useEffect(() => {
    if (highlightedPassageId && highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedPassageId, pinnedSourceId]);

  if (!source) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-3 h-11 border-b border-border/60">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => clearPin(symbol)}
          className="h-7 gap-1 px-2 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Sources
        </Button>
        <span className="h-4 w-px bg-border" />
        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground truncate">
          {source.category}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <h2 className="text-base font-semibold leading-snug mb-1">
          {source.title}
        </h2>
        <p className="text-xs text-muted-foreground mb-4">{source.date}</p>
        <div className="space-y-4 text-[13px] leading-relaxed text-foreground/90">
          {source.passages.map((p) => {
            const isHighlighted = highlightedPassageId === p.id;
            return (
              <div
                key={p.id}
                ref={isHighlighted ? highlightRef : undefined}
                className={cn(
                  "rounded-md px-3 py-2 -mx-3 transition",
                  isHighlighted && "highlight-pulse ring-1 ring-primary/30",
                )}
              >
                {p.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

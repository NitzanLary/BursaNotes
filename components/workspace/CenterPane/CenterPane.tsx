"use client";

import { useActiveTickerState } from "@/lib/store/workspace-store";
import { ChatTranscript } from "./ChatTranscript";
import { QueryInput } from "./QueryInput";

export function CenterPane() {
  const ticker = useActiveTickerState();
  if (!ticker) return null;

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-5 h-11 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{ticker.symbol}</span>
          <span className="text-xs text-muted-foreground">
            {ticker.sources.length} sources · {ticker.messages.length - 1} exchanges
          </span>
        </div>
      </div>
      <ChatTranscript tickerState={ticker} />
      <QueryInput tickerState={ticker} />
    </div>
  );
}

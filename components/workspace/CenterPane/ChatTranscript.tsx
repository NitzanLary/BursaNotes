"use client";

import { useEffect, useRef } from "react";
import type { TickerState } from "@/lib/store/workspace-store";
import { ChatMessage } from "./ChatMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";

export function ChatTranscript({ tickerState }: { tickerState: TickerState }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tickerState.messages.length, tickerState.isThinking]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {tickerState.messages.map((m) => (
          <ChatMessage key={m.id} message={m} tickerState={tickerState} />
        ))}
        {tickerState.isThinking && <ThinkingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

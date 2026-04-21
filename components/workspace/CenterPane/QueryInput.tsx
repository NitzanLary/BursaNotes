"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useWorkspace, type TickerState } from "@/lib/store/workspace-store";
import { getQuickReplies } from "@/lib/mock/chat";
import { cn } from "@/lib/utils";

export function QueryInput({ tickerState }: { tickerState: TickerState }) {
  const [value, setValue] = useState("");
  const sendUserMessage = useWorkspace((s) => s.sendUserMessage);
  const isThinking = tickerState.isThinking;

  const submit = (text?: string) => {
    const payload = (text ?? value).trim();
    if (!payload || isThinking) return;
    sendUserMessage(tickerState.symbol, payload);
    setValue("");
  };

  const quickReplies = getQuickReplies(tickerState.symbol);
  const showQuickReplies = tickerState.messages.length <= 1 && !isThinking;

  return (
    <div className="border-t border-border/60 bg-background">
      <div className="max-w-3xl mx-auto px-5 py-3 space-y-2">
        {showQuickReplies && (
          <div className="flex flex-wrap gap-1.5">
            {quickReplies.map((q) => (
              <button
                key={q.prompt}
                onClick={() => submit(q.prompt)}
                className="px-2.5 py-1 text-[11px] rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition"
              >
                {q.label}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className={cn(
            "flex items-end gap-2 rounded-2xl border border-border bg-surface px-4 py-3 focus-within:border-primary/60 focus-within:shadow-sm transition",
            isThinking && "opacity-60 pointer-events-none",
          )}
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={`Ask anything about ${tickerState.symbol}…`}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground leading-relaxed max-h-40 min-h-[1.5rem]"
          />
          <button
            type="submit"
            disabled={!value.trim() || isThinking}
            aria-label="Send"
            className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:brightness-110 transition shrink-0"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
        <div className="text-[10px] text-center text-muted-foreground">
          Prototype — answers are scripted against a fixture corpus. Every claim
          is citation-linked to a mock source.
        </div>
      </div>
    </div>
  );
}

"use client";

import { Sparkles, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import type { TickerState } from "@/lib/store/workspace-store";
import { cn } from "@/lib/utils";
import { CitationChip } from "./CitationChip";
import { InlineTable } from "./InlineTable";
import { InlineChart } from "./InlineChart";

export function ChatMessage({
  message,
  tickerState,
}: {
  message: ChatMessageType;
  tickerState: TickerState;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <Avatar isUser={isUser} />
      <div
        className={cn(
          "flex-1 min-w-0 flex flex-col gap-3",
          isUser && "items-end",
        )}
      >
        {message.blocks.map((block, i) => {
          if (block.kind === "text") {
            return (
              <div
                key={i}
                className={cn(
                  "text-[14px] leading-relaxed",
                  isUser
                    ? "rounded-2xl rounded-tr-sm bg-muted px-4 py-2.5 max-w-xl"
                    : "text-foreground/90",
                )}
              >
                <TextWithCitations
                  text={block.text}
                  citations={block.citations ?? []}
                  tickerState={tickerState}
                />
              </div>
            );
          }
          if (block.kind === "table") {
            const artifact = tickerState.artifacts.find(
              (a) => a.id === block.artifactId && a.kind === "table",
            );
            if (!artifact || artifact.kind !== "table") return null;
            return <InlineTable key={i} artifact={artifact} />;
          }
          if (block.kind === "chart") {
            const artifact = tickerState.artifacts.find(
              (a) => a.id === block.artifactId && a.kind === "visual",
            );
            if (!artifact || artifact.kind !== "visual") return null;
            return <InlineChart key={i} artifact={artifact} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}

function Avatar({ isUser }: { isUser: boolean }) {
  return (
    <div
      className={cn(
        "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
        isUser ? "bg-foreground/10" : "bg-primary/10",
      )}
    >
      {isUser ? (
        <User className="h-3.5 w-3.5 text-foreground/70" />
      ) : (
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      )}
    </div>
  );
}

function TextWithCitations({
  text,
  citations,
  tickerState,
}: {
  text: string;
  citations: { sourceId: string; passageId: string; label: string }[];
  tickerState: TickerState;
}) {
  const parts = text.split(/(\[\d+\])/g);
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        const match = part.match(/^\[(\d+)\]$/);
        if (!match) return <span key={i}>{part}</span>;
        const label = match[1];
        const citation = citations.find((c) => c.label === label);
        if (!citation) return <span key={i}>{part}</span>;
        return (
          <CitationChip
            key={i}
            label={label}
            citation={citation}
            tickerState={tickerState}
          />
        );
      })}
    </div>
  );
}

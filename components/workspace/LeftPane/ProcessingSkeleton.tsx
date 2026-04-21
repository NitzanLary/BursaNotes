"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_MESSAGES = [
  "Gathering 10-Ks…",
  "Scanning recent news…",
  "Indexing earnings calls…",
  "Building source graph…",
];

export function ProcessingSkeleton() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setIdx((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 600);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 h-11 border-b border-border/60">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sources
        </span>
      </div>
      <div className="flex-1 px-4 py-3 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span>{STATUS_MESSAGES[idx]}</span>
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground/40 mt-0.5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

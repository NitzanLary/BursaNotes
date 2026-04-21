"use client";

import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { getInsightsForTicker } from "@/lib/mock/insights";
import type { Insight } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OverviewTab({ ticker }: { ticker: string }) {
  const data = getInsightsForTicker(ticker);

  return (
    <div className="p-3 space-y-4">
      <section>
        <SectionHeader title="Key metrics" />
        <div className="grid grid-cols-2 gap-2">
          {data.metrics.map((m) => (
            <MetricCard key={m.label} metric={m} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title={`Top ${data.risks.length} risks`} />
        <div className="space-y-1.5">
          {data.risks.map((r, i) => (
            <div
              key={i}
              className="rounded-md border border-border bg-surface p-2.5"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {r.detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Team brief" />
        <button
          onClick={() => toast.success("Copied team summary (demo)")}
          className="w-full rounded-md border border-border bg-surface p-3 text-left hover:border-primary/50 transition group"
        >
          <div className="flex items-center gap-2 text-[12px] font-medium">
            <Copy className="h-3.5 w-3.5 text-primary" />
            Copy a 5-line summary to clipboard
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            Formatted brief of the current thesis + top risks, ready to paste
            into Slack or email.
          </div>
        </button>
      </section>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 px-0.5">
      {title}
    </div>
  );
}

function MetricCard({ metric }: { metric: Insight }) {
  const TrendIcon =
    metric.tone === "positive"
      ? TrendingUp
      : metric.tone === "negative"
        ? TrendingDown
        : null;
  return (
    <div className="rounded-md border border-border bg-surface p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {metric.label}
      </div>
      <div className="text-[18px] font-semibold mt-1 tabular-nums">
        {metric.value}
      </div>
      {metric.delta && (
        <div
          className={cn(
            "flex items-center gap-1 text-[11px] mt-0.5",
            metric.tone === "positive" && "text-emerald-600 dark:text-emerald-400",
            metric.tone === "negative" && "text-rose-600 dark:text-rose-400",
            (!metric.tone || metric.tone === "neutral") && "text-muted-foreground",
          )}
        >
          {TrendIcon && <TrendIcon className="h-3 w-3" />}
          <span>{metric.delta}</span>
        </div>
      )}
    </div>
  );
}

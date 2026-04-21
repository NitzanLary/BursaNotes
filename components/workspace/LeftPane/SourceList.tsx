"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FileText, Newspaper, Plus, Upload, Link2, Loader2, CheckCircle2 } from "lucide-react";
import type { Source, SourceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useWorkspace, type TickerState } from "@/lib/store/workspace-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const CATEGORY_ORDER: SourceCategory[] = [
  "SEC Filings",
  "Quarterly Reports",
  "Recent News",
  "Bespoke",
];

export function SourceList({
  tickerState,
}: {
  tickerState: TickerState & { symbol: string };
}) {
  const grouped = useMemo(() => {
    const map: Record<string, Source[]> = {};
    for (const s of tickerState.sources) {
      (map[s.category] ||= []).push(s);
    }
    return map;
  }, [tickerState.sources]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 h-11 border-b border-border/60">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sources · {tickerState.symbol}
        </span>
        <AddSourceButton symbol={tickerState.symbol} />
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {CATEGORY_ORDER.filter((c) => grouped[c]?.length).map((cat) => (
          <SourceGroup
            key={cat}
            category={cat}
            sources={grouped[cat]}
            symbol={tickerState.symbol}
          />
        ))}
      </div>
    </div>
  );
}

function SourceGroup({
  category,
  sources,
  symbol,
}: {
  category: SourceCategory;
  sources: Source[];
  symbol: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition"
      >
        {open ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        <span className="tracking-tight">{category}</span>
        <span className="ml-auto text-[10px] tabular-nums text-muted-foreground">
          {sources.length}
        </span>
      </button>
      {open && (
        <div className="space-y-0.5">
          {sources.map((s) => (
            <SourceItem key={s.id} source={s} symbol={symbol} />
          ))}
        </div>
      )}
    </div>
  );
}

function SourceItem({ source, symbol }: { source: Source; symbol: string }) {
  const pinSource = useWorkspace((s) => s.pinSource);
  const Icon = source.category === "Recent News" ? Newspaper : FileText;

  return (
    <button
      onClick={() => pinSource(symbol, source.id)}
      className={cn(
        "group w-full flex items-start gap-2 px-2 py-1.5 rounded-md text-left text-sm hover:bg-muted transition",
      )}
    >
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] leading-snug line-clamp-2 group-hover:text-foreground">
          {source.title}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
          <StatusDot status={source.status} />
          <span>{source.date}</span>
        </div>
      </div>
    </button>
  );
}

function StatusDot({ status }: { status: Source["status"] }) {
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px]">
        <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
        <span>indexing</span>
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-destructive">
        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
        <span>failed</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px]">
      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
      <span>ready</span>
    </span>
  );
}

function AddSourceButton({ symbol }: { symbol: string }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const addSource = useWorkspace((s) => s.addSource);

  const attach = (kind: "pdf" | "url") => {
    const id = `custom-${symbol.toLowerCase()}-${Date.now()}`;
    addSource(symbol, {
      id,
      title: kind === "pdf"
        ? "Uploaded research note.pdf (Demo)"
        : url || "Pasted link (Demo)",
      category: "Bespoke",
      status: "ready",
      date: new Date().toISOString().slice(0, 10),
      passages: [
        {
          id: "p1",
          text: "This is a demo source added via the Add Source dialog. In production, the content would be fetched and indexed.",
        },
      ],
    });
    toast.success(kind === "pdf" ? "Attached PDF (demo)" : "Attached link (demo)");
    setOpen(false);
    setUrl("");
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-7 gap-1 text-xs"
      >
        <Plus className="h-3.5 w-3.5" />
        Add
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a source</DialogTitle>
            <DialogDescription>
              Attach a bespoke PDF or paste a link. In this prototype both are
              stubbed — the source will appear under &ldquo;Bespoke&rdquo; with
              placeholder content.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={() => attach("pdf")} className="justify-start">
              <Upload className="h-4 w-4" /> Upload PDF
            </Button>
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:border-primary/60"
              />
              <Button onClick={() => attach("url")} disabled={!url.trim()} size="sm">
                Attach
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

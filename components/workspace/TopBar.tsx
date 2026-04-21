"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpenText, Plus, Users, X } from "lucide-react";
import { useState } from "react";
import { useWorkspace } from "@/lib/store/workspace-store";
import { resolveTicker } from "@/lib/mock/tickers";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function TopBar() {
  const router = useRouter();
  const openTickers = useWorkspace((s) => s.openTickers);
  const activeTicker = useWorkspace((s) => s.activeTicker);
  const setActiveTicker = useWorkspace((s) => s.setActiveTicker);
  const closeTicker = useWorkspace((s) => s.closeTicker);
  const openTicker = useWorkspace((s) => s.openTicker);
  const [addOpen, setAddOpen] = useState(false);
  const [newTicker, setNewTicker] = useState("");

  const submitNew = () => {
    const clean = newTicker.trim().toUpperCase();
    if (!clean) return;
    openTicker(clean);
    setNewTicker("");
    setAddOpen(false);
    router.push(`/n/${encodeURIComponent(clean)}`);
  };

  return (
    <header className="flex items-center gap-3 px-3 h-12 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <Link
        href="/"
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition shrink-0"
      >
        <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
          <BookOpenText className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-sm font-semibold tracking-tight">BursaNotes</span>
      </Link>

      <div className="h-5 w-px bg-border" />

      <div className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto">
        {openTickers.map((t) => {
          const info = resolveTicker(t);
          const isActive = t === activeTicker;
          return (
            <div
              key={t}
              className={cn(
                "group flex items-center gap-1.5 pl-3 pr-1.5 h-8 rounded-md border text-sm transition shrink-0",
                isActive
                  ? "bg-surface border-border text-foreground"
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <button
                onClick={() => {
                  setActiveTicker(t);
                  router.push(`/n/${encodeURIComponent(t)}`);
                }}
                className="flex items-center gap-1.5 max-w-[180px]"
              >
                <span className="font-medium">{t}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {info.name.replace(/(Inc\.|Corporation|Corp\.|Platforms,|\,)/g, "").trim()}
                </span>
              </button>
              <button
                aria-label={`Close ${t}`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTicker(t);
                  const remaining = openTickers.filter((s) => s !== t);
                  if (remaining.length === 0) {
                    router.push("/");
                  } else if (activeTicker === t) {
                    const next = remaining[remaining.length - 1];
                    router.push(`/n/${encodeURIComponent(next)}`);
                  }
                }}
                className="h-5 w-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-muted transition"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
        <button
          onClick={() => setAddOpen(true)}
          aria-label="Open new ticker"
          className="h-8 w-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition flex items-center justify-center shrink-0"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Tooltip>
        <TooltipTrigger
          render={
            <button
              aria-label="Team view (coming soon)"
              className="h-8 w-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition flex items-center justify-center opacity-60"
              disabled
            >
              <Users className="h-4 w-4" />
            </button>
          }
        />
        <TooltipContent>Team view (coming soon)</TooltipContent>
      </Tooltip>

      <ThemeToggle />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open a new ticker</DialogTitle>
            <DialogDescription>
              Type a symbol (e.g. GOOGL, NVDA, META) to start a new notebook.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitNew();
            }}
            className="flex flex-col gap-3"
          >
            <input
              autoFocus
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
              placeholder="Ticker symbol"
              className="px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:border-primary/60"
            />
          </form>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={submitNew} disabled={!newTicker.trim()}>
              Open
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

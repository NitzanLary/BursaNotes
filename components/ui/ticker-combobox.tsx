"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import fuzzysort from "fuzzysort";
import { Search } from "lucide-react";
import type { Ticker } from "@/lib/types";
import { useTickers } from "@/lib/tickers/client";
import { cn } from "@/lib/utils";

interface TickerComboboxProps {
  onSelect: (ticker: Ticker) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
  showSearchIcon?: boolean;
}

const MAX_RESULTS = 50;

function rank(query: string, tickers: Ticker[]): Ticker[] {
  const q = query.trim();
  if (!q) return [];
  const results = fuzzysort.go(q, tickers, {
    keys: ["symbol", "name"],
    limit: MAX_RESULTS,
    threshold: -10000,
    scoreFn: (r) => {
      const symbolScore = r[0] ? r[0].score + 1000 : -Infinity;
      const nameScore = r[1] ? r[1].score : -Infinity;
      let score = Math.max(symbolScore, nameScore);
      if (r.obj.symbol.includes("$")) score -= 500;
      return score;
    },
  });
  return results.map((r) => r.obj);
}

export function TickerCombobox({
  onSelect,
  placeholder = "Search a ticker or company…",
  autoFocus,
  className,
  inputClassName,
  showSearchIcon = true,
}: TickerComboboxProps) {
  const { tickers, loading } = useTickers();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filtered = React.useMemo(
    () => rank(query, tickers),
    [query, tickers],
  );

  const trimmed = query.trim().toUpperCase();
  const hasQuery = trimmed.length > 0;
  const hasExact = filtered.some((t) => t.symbol === trimmed);
  const showOpenAnyway = hasQuery && !hasExact;

  const handleValueChange = (value: Ticker | null) => {
    if (!value) return;
    onSelect(value);
  };

  return (
    <Combobox.Root<Ticker>
      items={tickers}
      filteredItems={filtered}
      filter={null}
      autoHighlight
      openOnInputClick={false}
      open={open && hasQuery}
      onOpenChange={setOpen}
      itemToStringLabel={(t) => t.symbol}
      itemToStringValue={(t) => t.symbol}
      inputValue={query}
      onInputValueChange={(v) => {
        setQuery(v);
        setOpen(v.trim().length > 0);
      }}
      onValueChange={handleValueChange}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border bg-background px-3 h-10 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 transition",
          className,
        )}
      >
        {showSearchIcon && (
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <Combobox.Input
          autoFocus={autoFocus}
          disabled={loading}
          placeholder={loading ? "Loading tickers…" : placeholder}
          spellCheck={false}
          autoComplete="off"
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-muted-foreground",
            inputClassName,
          )}
        />
      </div>

      <Combobox.Portal>
        <Combobox.Positioner className="z-[60] outline-none" sideOffset={6}>
          <Combobox.Popup className="w-[var(--anchor-width)] max-h-80 overflow-auto rounded-lg border border-border bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5">
            <Combobox.List>
              {showOpenAnyway && (
                <Combobox.Item
                  value={{
                    symbol: trimmed,
                    name: `${trimmed} (Demo)`,
                    exchange: "NASDAQ",
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer data-highlighted:bg-muted outline-none border-b border-border/60"
                >
                  <span className="font-mono font-semibold">{trimmed}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    Open anyway (demo data)
                  </span>
                </Combobox.Item>
              )}
              {filtered.map((t) => (
                <Combobox.Item
                  key={t.symbol}
                  value={t}
                  className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer data-highlighted:bg-muted outline-none"
                >
                  <span className="font-mono font-semibold w-16 shrink-0">
                    {t.symbol}
                  </span>
                  <span className="flex-1 truncate text-muted-foreground">
                    {t.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
                    {t.exchange}
                    {t.isEtf ? " · ETF" : ""}
                  </span>
                </Combobox.Item>
              ))}
              {!showOpenAnyway && filtered.length === 0 && !loading && (
                <Combobox.Empty className="px-3 py-4 text-sm text-muted-foreground text-center">
                  No tickers match your search.
                </Combobox.Empty>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

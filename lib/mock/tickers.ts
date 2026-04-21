import type { Ticker } from "@/lib/types";

export const KNOWN_TICKERS: Record<string, Ticker> = {
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ" },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
  META: { symbol: "META", name: "Meta Platforms, Inc.", exchange: "NASDAQ" },
  AAPL: { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
  MSFT: { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
};

export function resolveTicker(symbol: string): Ticker {
  const up = symbol.toUpperCase();
  return (
    KNOWN_TICKERS[up] ?? {
      symbol: up,
      name: `${up} (Demo)`,
      exchange: "NASDAQ",
    }
  );
}

export const SUGGESTED_TICKERS = ["GOOGL", "NVDA", "META", "AAPL", "MSFT"];

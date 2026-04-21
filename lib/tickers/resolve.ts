import type { Ticker } from "@/lib/types";
import { resolveTicker as resolveMockTicker } from "@/lib/mock/tickers";

export function resolveTicker(symbol: string, list?: Ticker[]): Ticker {
  const up = symbol.toUpperCase();
  if (list && list.length > 0) {
    const hit = list.find((t) => t.symbol === up);
    if (hit) return hit;
  }
  return resolveMockTicker(up);
}

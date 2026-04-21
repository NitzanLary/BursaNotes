"use client";

import { useEffect, useState } from "react";
import type { Ticker } from "@/lib/types";

let cache: Promise<Ticker[]> | null = null;

export function loadTickers(): Promise<Ticker[]> {
  if (!cache) {
    cache = fetch("/api/tickers")
      .then((r) => (r.ok ? (r.json() as Promise<Ticker[]>) : []))
      .catch(() => [] as Ticker[]);
  }
  return cache;
}

export function useTickers() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadTickers().then((list) => {
      if (!active) return;
      setTickers(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { tickers, loading };
}

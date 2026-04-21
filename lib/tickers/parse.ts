import type { Ticker } from "@/lib/types";

export const EXCHANGE_CODE_MAP: Record<string, string> = {
  N: "NYSE",
  A: "NYSE American",
  P: "NYSE Arca",
  Z: "Cboe BZX",
  V: "IEX",
};

function splitRows(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.length > 0 && !line.startsWith("File Creation Time"))
    .map((line) => line.split("|"));
}

export function parseNasdaqListed(text: string): Ticker[] {
  const rows = splitRows(text);
  if (rows.length === 0) return [];
  const [header, ...data] = rows;
  const idx = {
    symbol: header.indexOf("Symbol"),
    name: header.indexOf("Security Name"),
    testIssue: header.indexOf("Test Issue"),
    etf: header.indexOf("ETF"),
  };
  const out: Ticker[] = [];
  for (const row of data) {
    if (row[idx.testIssue] === "Y") continue;
    const symbol = row[idx.symbol];
    const name = row[idx.name];
    if (!symbol || !name) continue;
    out.push({
      symbol,
      name,
      exchange: "NASDAQ",
      isEtf: row[idx.etf] === "Y" ? true : undefined,
    });
  }
  return out;
}

export function parseOtherListed(text: string): Ticker[] {
  const rows = splitRows(text);
  if (rows.length === 0) return [];
  const [header, ...data] = rows;
  const idx = {
    symbol: header.indexOf("ACT Symbol"),
    name: header.indexOf("Security Name"),
    exchange: header.indexOf("Exchange"),
    testIssue: header.indexOf("Test Issue"),
    etf: header.indexOf("ETF"),
  };
  const out: Ticker[] = [];
  for (const row of data) {
    if (row[idx.testIssue] === "Y") continue;
    const symbol = row[idx.symbol];
    const name = row[idx.name];
    if (!symbol || !name) continue;
    const code = row[idx.exchange];
    out.push({
      symbol,
      name,
      exchange: EXCHANGE_CODE_MAP[code] ?? code,
      isEtf: row[idx.etf] === "Y" ? true : undefined,
    });
  }
  return out;
}

export function mergeTickers(a: Ticker[], b: Ticker[]): Ticker[] {
  const bySymbol = new Map<string, Ticker>();
  for (const t of b) bySymbol.set(t.symbol, t);
  for (const t of a) bySymbol.set(t.symbol, t);
  return Array.from(bySymbol.values()).sort((x, y) =>
    x.symbol.localeCompare(y.symbol),
  );
}

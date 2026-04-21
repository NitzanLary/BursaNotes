import type { TickerInsights } from "@/lib/types";

const BASE: Record<string, TickerInsights> = {
  GOOGL: {
    metrics: [
      { label: "P/E (TTM)", value: "24.3", delta: "−1.2 vs 3mo", tone: "neutral" },
      { label: "Revenue Growth (YoY)", value: "14.1%", delta: "+2.4pp", tone: "positive" },
      { label: "Operating Margin", value: "32.4%", delta: "+3.3pp", tone: "positive" },
      { label: "Free Cash Flow (TTM)", value: "$82.1B", delta: "+11%", tone: "positive" },
    ],
    risks: [
      {
        title: "DOJ Search remedies",
        detail:
          "Potential forced divestiture of Chrome and restrictions on default search payments could disrupt distribution.",
      },
      {
        title: "AI capex intensity",
        detail:
          "2026 capex guided to ~$75B (+29% YoY), pressuring near-term FCF and margin optics.",
      },
      {
        title: "EU Digital Markets Act",
        detail:
          "Ongoing compliance obligations may limit product integration across Google Services.",
      },
    ],
  },
  NVDA: {
    metrics: [
      { label: "P/E (TTM)", value: "38.9", delta: "+2.1 vs 3mo", tone: "neutral" },
      { label: "Revenue Growth (YoY)", value: "72.4%", delta: "−14pp", tone: "neutral" },
      { label: "Gross Margin", value: "74.9%", delta: "−0.8pp", tone: "neutral" },
      { label: "Free Cash Flow (TTM)", value: "$98.3B", delta: "+58%", tone: "positive" },
    ],
    risks: [
      {
        title: "Customer concentration",
        detail: "Top 4 customers = ~46% of FY26 revenue; hyperscaler spend cycles are the swing variable.",
      },
      {
        title: "Export controls",
        detail:
          "New tiered licensing framework could cap AI chip shipments starting Q3 2026.",
      },
      {
        title: "Supply & yield on Blackwell Ultra",
        detail:
          "Ramp ahead of schedule but supply constrained through H1 FY27 — any yield slippage reprices the multiple.",
      },
    ],
  },
};

export function getInsightsForTicker(ticker: string): TickerInsights {
  const key = ticker.toUpperCase();
  if (BASE[key]) return BASE[key];
  return {
    metrics: [
      { label: "P/E (TTM)", value: "—", tone: "neutral" },
      { label: "Revenue Growth (YoY)", value: "—", tone: "neutral" },
      { label: "Operating Margin", value: "—", tone: "neutral" },
      { label: "Free Cash Flow (TTM)", value: "—", tone: "neutral" },
    ],
    risks: [
      { title: "No data yet", detail: `Demo ticker ${key} — insights will populate once real sources are wired.` },
    ],
  };
}

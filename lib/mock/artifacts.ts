import type { Artifact } from "@/lib/types";

const NOW = "2026-04-20T10:00:00Z";

const GOOGL_SEEDS: Artifact[] = [
  {
    id: "googl-artifact-thesis",
    kind: "text",
    title: "Alphabet — Bull/Bear Thesis",
    createdAt: NOW,
    ticker: "GOOGL",
    tone: "summary",
    body:
      "Bull case: Cloud approaches $60B ARR with expanding margins; Gemini integration across Workspace and Search drives monetization per query; YouTube ad load re-accelerates.\n\nBear case: DOJ remedies constrain Search distribution economics; 2026 capex of ~$75B compresses near-term FCF; open-source frontier models (Meta, DeepSeek) erode API pricing power.",
  },
  {
    id: "googl-artifact-segments",
    kind: "table",
    title: "FY25 Segment Revenue & YoY Growth",
    createdAt: NOW,
    ticker: "GOOGL",
    caption: "Source: FY2025 10-K",
    columns: ["Segment", "FY25 Revenue", "YoY %", "Op. Margin"],
    rows: [
      ["Google Services", "$322.4B", "+11%", "39.8%"],
      ["Google Cloud", "$48.2B", "+32%", "18.6%"],
      ["Other Bets", "$1.9B", "+6%", "n/m"],
      ["Hedging", "$5.9B", "—", "—"],
    ],
  },
  {
    id: "googl-artifact-revtrend",
    kind: "visual",
    title: "Quarterly Revenue — Last 8 Quarters",
    createdAt: NOW,
    ticker: "GOOGL",
    chartType: "line",
    xLabels: ["Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25"],
    series: [
      {
        label: "Revenue ($B)",
        values: [80.5, 84.7, 88.3, 96.5, 89.1, 92.4, 94.2, 104.1],
      },
    ],
  },
];

const NVDA_SEEDS: Artifact[] = [
  {
    id: "nvda-artifact-thesis",
    kind: "text",
    title: "NVIDIA — Investment Thesis (Draft)",
    createdAt: NOW,
    ticker: "NVDA",
    tone: "summary",
    body:
      "Demand remains supply-bound through H1 FY27 on Blackwell Ultra. Hyperscaler capex commitments for 2026 are the primary driver; sovereign AI deals add a second leg.\n\nKey watches: (1) export control tiering, (2) ASIC competitive response from hyperscalers, (3) pricing power as inference workloads shift from training-dominant to mixed.",
  },
  {
    id: "nvda-artifact-datacenter",
    kind: "table",
    title: "Data Center Revenue — Trailing 5 Quarters",
    createdAt: NOW,
    ticker: "NVDA",
    caption: "Source: FY2026 filings",
    columns: ["Quarter", "DC Revenue", "YoY %", "% of Total"],
    rows: [
      ["Q4 FY25", "$27.6B", "+163%", "86%"],
      ["Q1 FY26", "$35.2B", "+127%", "88%"],
      ["Q2 FY26", "$42.8B", "+104%", "87%"],
      ["Q3 FY26", "$55.2B", "+92%", "85%"],
      ["Q4 FY26", "$49.2B", "+78%", "85%"],
    ],
  },
  {
    id: "nvda-artifact-dcgrowth",
    kind: "visual",
    title: "Data Center Revenue Trajectory",
    createdAt: NOW,
    ticker: "NVDA",
    chartType: "bar",
    xLabels: ["Q4'25", "Q1'26", "Q2'26", "Q3'26", "Q4'26"],
    series: [{ label: "DC Rev ($B)", values: [27.6, 35.2, 42.8, 55.2, 49.2] }],
  },
];

const SEEDS: Record<string, Artifact[]> = {
  GOOGL: GOOGL_SEEDS,
  NVDA: NVDA_SEEDS,
};

export function getSeedArtifacts(ticker: string): Artifact[] {
  return SEEDS[ticker.toUpperCase()] ?? [];
}

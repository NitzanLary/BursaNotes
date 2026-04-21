import type { Source } from "@/lib/types";

const BASE_SOURCES: Record<string, Source[]> = {
  GOOGL: [
    {
      id: "googl-10k-2025",
      title: "Alphabet Inc. — Form 10-K (FY2025)",
      category: "SEC Filings",
      status: "ready",
      date: "2026-02-04",
      passages: [
        {
          id: "p1",
          text: "Total revenues increased 14% year-over-year to $378.4B, driven primarily by Google Services (+11%) and Google Cloud (+32%).",
        },
        {
          id: "p2",
          text: "Operating margin expanded to 32.4% from 29.1% in the prior year, reflecting disciplined headcount growth and AI-driven efficiency gains across Search and YouTube.",
        },
        {
          id: "p3",
          text: "Capital expenditures reached $58.2B, concentrated in AI infrastructure (TPUs, data centers) to support Gemini model training and inference demand.",
        },
        {
          id: "p4",
          text: "We face ongoing antitrust scrutiny in the United States and the European Union, including the DOJ remedies proceeding related to Google Search distribution, which may materially affect our business.",
        },
      ],
    },
    {
      id: "googl-10q-q4-2025",
      title: "Alphabet Inc. — Form 10-Q (Q4 FY2025)",
      category: "Quarterly Reports",
      status: "ready",
      date: "2026-02-04",
      passages: [
        {
          id: "p1",
          text: "Q4 revenue grew 16% YoY to $104.1B; Google Cloud revenue grew 35% YoY to $13.9B with operating margin of 19.2%.",
        },
        {
          id: "p2",
          text: "Free cash flow for the quarter was $22.7B. Share repurchases totaled $15.5B.",
        },
      ],
    },
    {
      id: "googl-10q-q3-2025",
      title: "Alphabet Inc. — Form 10-Q (Q3 FY2025)",
      category: "Quarterly Reports",
      status: "ready",
      date: "2025-10-28",
      passages: [
        {
          id: "p1",
          text: "Q3 revenue grew 13% YoY to $94.2B; YouTube ads grew 11% YoY to $9.3B.",
        },
      ],
    },
    {
      id: "googl-news-1",
      title: "Alphabet beats Q4 on Cloud, AI capex to rise in 2026 — Reuters",
      category: "Recent News",
      status: "ready",
      date: "2026-02-05",
      passages: [
        {
          id: "p1",
          text: "Alphabet told investors on its Q4 earnings call that 2026 capital expenditures will reach approximately $75B, an increase of roughly 29% year-over-year, weighted toward AI compute.",
        },
      ],
    },
    {
      id: "googl-news-2",
      title: "DOJ files final remedies brief in Search antitrust case — WSJ",
      category: "Recent News",
      status: "ready",
      date: "2026-03-18",
      passages: [
        {
          id: "p1",
          text: "The Department of Justice asked the court to require Google to divest Chrome and bar payments to Apple and other distribution partners for default search placement.",
        },
      ],
    },
  ],
  NVDA: [
    {
      id: "nvda-10k-fy26",
      title: "NVIDIA Corp. — Form 10-K (FY2026)",
      category: "SEC Filings",
      status: "ready",
      date: "2026-02-27",
      passages: [
        {
          id: "p1",
          text: "Fiscal 2026 revenue grew 72% to $215.1B, led by Data Center revenue of $182.4B (+89%). Gross margin was 74.9% on a GAAP basis.",
        },
        {
          id: "p2",
          text: "Blackwell and Blackwell Ultra shipments ramped ahead of schedule, with supply constrained through the first half of fiscal 2027.",
        },
        {
          id: "p3",
          text: "Customer concentration remains elevated: our top four customers accounted for approximately 46% of revenue in fiscal 2026.",
        },
        {
          id: "p4",
          text: "U.S. export controls on advanced computing products to China, Russia, and certain other jurisdictions continue to affect our ability to sell into those markets.",
        },
      ],
    },
    {
      id: "nvda-10q-q4-fy26",
      title: "NVIDIA Corp. — Form 10-Q (Q4 FY2026)",
      category: "Quarterly Reports",
      status: "ready",
      date: "2026-02-27",
      passages: [
        {
          id: "p1",
          text: "Q4 revenue was $57.8B, up 62% YoY. Data Center revenue was $49.2B, up 78% YoY.",
        },
        {
          id: "p2",
          text: "Non-GAAP operating margin was 66.1%. Free cash flow was $32.9B in the quarter.",
        },
      ],
    },
    {
      id: "nvda-news-1",
      title: "NVIDIA guides Q1 above Street on AI demand — Bloomberg",
      category: "Recent News",
      status: "ready",
      date: "2026-02-28",
      passages: [
        {
          id: "p1",
          text: "NVIDIA guided Q1 FY2027 revenue of $61B (+/- 2%), above the consensus estimate of $58B, citing robust demand for Blackwell Ultra systems from hyperscalers and sovereign customers.",
        },
      ],
    },
    {
      id: "nvda-news-2",
      title: "New U.S. export rule tightens AI chip shipments — FT",
      category: "Recent News",
      status: "processing",
      date: "2026-04-12",
      passages: [
        {
          id: "p1",
          text: "The Commerce Department proposed a tiered licensing framework that would cap advanced AI chip exports to a broader list of jurisdictions starting in Q3 2026.",
        },
      ],
    },
  ],
};

export function getSourcesForTicker(ticker: string): Source[] {
  const key = ticker.toUpperCase();
  if (BASE_SOURCES[key]) return BASE_SOURCES[key];

  return [
    {
      id: `${key.toLowerCase()}-10k-demo`,
      title: `${key} — Form 10-K (Demo)`,
      category: "SEC Filings",
      status: "ready",
      date: "2026-01-01",
      passages: [
        {
          id: "p1",
          text: `Demo filing content for ${key}. Real SEC integration is not wired in this prototype — this is a placeholder source used to exercise the UI.`,
        },
      ],
    },
    {
      id: `${key.toLowerCase()}-news-demo`,
      title: `${key} — Latest coverage (Demo)`,
      category: "Recent News",
      status: "ready",
      date: "2026-04-10",
      passages: [
        {
          id: "p1",
          text: `Placeholder news article for ${key}. Swap in a real news fetcher to populate this category.`,
        },
      ],
    },
  ];
}

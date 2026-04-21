import type { Artifact, ChatMessage } from "@/lib/types";

export interface ScriptedResponse {
  message: ChatMessage;
  artifacts?: Artifact[];
}

interface QuickReply {
  prompt: string;
  label: string;
}

interface TickerScript {
  quickReplies: QuickReply[];
  responders: Array<{
    match: (q: string) => boolean;
    respond: () => ScriptedResponse;
  }>;
  fallback: () => ScriptedResponse;
}

const GOOGL_SCRIPT: TickerScript = {
  quickReplies: [
    { prompt: "Summarize GOOGL's FY25 results", label: "FY25 highlights" },
    { prompt: "Break down segment revenue and margins", label: "Segment breakdown" },
    { prompt: "What are the top risks for GOOGL?", label: "Top risks" },
    { prompt: "How has revenue trended over the last 8 quarters?", label: "Revenue trend" },
  ],
  responders: [
    {
      match: (q) => /fy25|fiscal 2025|full year|annual|summary|highlights/i.test(q),
      respond: () => ({
        message: {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          blocks: [
            {
              kind: "text",
              text:
                "Alphabet's FY2025 came in strong. Total revenue grew 14% YoY to $378.4B, led by Google Services (+11%) and Google Cloud (+32%) [1]. Operating margin expanded roughly 330 bps to 32.4% on AI-driven efficiency [2]. The flip side: capex stepped up to $58.2B, concentrated in AI infrastructure [3], and management guided FY26 capex to ~$75B on the Q4 call [4].",
              citations: [
                { sourceId: "googl-10k-2025", passageId: "p1", label: "1" },
                { sourceId: "googl-10k-2025", passageId: "p2", label: "2" },
                { sourceId: "googl-10k-2025", passageId: "p3", label: "3" },
                { sourceId: "googl-news-1", passageId: "p1", label: "4" },
              ],
            },
          ],
        },
      }),
    },
    {
      match: (q) => /segment|breakdown|revenue.*segment|service.*cloud/i.test(q),
      respond: () => {
        const artifactId = "googl-artifact-segments";
        return {
          message: {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            blocks: [
              {
                kind: "text",
                text:
                  "Here is the FY25 segment view. Google Services remains the profit engine; Cloud continues to scale margin as it grows [1].",
                citations: [{ sourceId: "googl-10k-2025", passageId: "p1", label: "1" }],
              },
              { kind: "table", artifactId },
            ],
          },
        };
      },
    },
    {
      match: (q) => /risk|concern|bear|downside|antitrust|doj|regulation/i.test(q),
      respond: () => ({
        message: {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          blocks: [
            {
              kind: "text",
              text:
                "Three things dominate the risk conversation: (1) the DOJ remedies proceeding — the government is pushing for Chrome divestiture and a ban on default-search payments [1], which would pressure distribution economics; (2) AI capex intensity — ~$75B guided for 2026 [2]; and (3) ongoing antitrust exposure in the EU [3].",
              citations: [
                { sourceId: "googl-news-2", passageId: "p1", label: "1" },
                { sourceId: "googl-news-1", passageId: "p1", label: "2" },
                { sourceId: "googl-10k-2025", passageId: "p4", label: "3" },
              ],
            },
          ],
        },
      }),
    },
    {
      match: (q) => /trend|trajectory|quarterly|last.*quarter|over time/i.test(q),
      respond: () => ({
        message: {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          blocks: [
            {
              kind: "text",
              text:
                "Revenue has re-accelerated through 2025, with Q4 topping $104B [1]. The pattern is consistent with cloud growth outpacing services and AI-driven Search monetization kicking in.",
              citations: [{ sourceId: "googl-10q-q4-2025", passageId: "p1", label: "1" }],
            },
            { kind: "chart", artifactId: "googl-artifact-revtrend" },
          ],
        },
      }),
    },
    {
      match: (q) => /thesis|memo|bull.*bear|summary.*team|team.*summary/i.test(q),
      respond: () => ({
        message: {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          blocks: [
            {
              kind: "text",
              text: "Drafted a bull/bear thesis card — available under the Text tab in the Artifacts pane.",
            },
          ],
        },
        artifacts: [],
      }),
    },
  ],
  fallback: () => ({
    message: {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      blocks: [
        {
          kind: "text",
          text:
            "This is a prototype — I can answer from a small set of canned Alphabet questions. Try one of the suggested prompts, or ask about FY25 results, segments, risks, or the revenue trend.",
        },
      ],
    },
  }),
};

const NVDA_SCRIPT: TickerScript = {
  quickReplies: [
    { prompt: "Summarize NVDA's FY26 results", label: "FY26 highlights" },
    { prompt: "Break down Data Center revenue by quarter", label: "Data Center trend" },
    { prompt: "What are the top risks for NVDA?", label: "Top risks" },
    { prompt: "How concentrated is the customer base?", label: "Customer mix" },
  ],
  responders: [
    {
      match: (q) => /fy26|fiscal 2026|full year|annual|summary|highlights/i.test(q),
      respond: () => ({
        message: {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          blocks: [
            {
              kind: "text",
              text:
                "NVIDIA's FY2026 revenue grew 72% to $215.1B, with Data Center at $182.4B (+89%) [1]. Blackwell and Blackwell Ultra ramp was ahead of plan but remains supply-constrained through H1 FY27 [2]. Q1 FY27 guidance of $61B ±2% came in above the Street [3].",
              citations: [
                { sourceId: "nvda-10k-fy26", passageId: "p1", label: "1" },
                { sourceId: "nvda-10k-fy26", passageId: "p2", label: "2" },
                { sourceId: "nvda-news-1", passageId: "p1", label: "3" },
              ],
            },
          ],
        },
      }),
    },
    {
      match: (q) => /data center|dc.*revenue|segment|breakdown/i.test(q),
      respond: () => ({
        message: {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          blocks: [
            {
              kind: "text",
              text:
                "Data Center has been the growth engine, consistently 85%+ of total [1]. The sequential dip in Q4 FY26 is supply-driven, not demand [2].",
              citations: [
                { sourceId: "nvda-10q-q4-fy26", passageId: "p1", label: "1" },
                { sourceId: "nvda-10k-fy26", passageId: "p2", label: "2" },
              ],
            },
            { kind: "table", artifactId: "nvda-artifact-datacenter" },
            { kind: "chart", artifactId: "nvda-artifact-dcgrowth" },
          ],
        },
      }),
    },
    {
      match: (q) => /risk|concern|bear|downside|export|control|concentration/i.test(q),
      respond: () => ({
        message: {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          blocks: [
            {
              kind: "text",
              text:
                "The three big watches: (1) customer concentration — top 4 = ~46% of revenue [1]; (2) export controls — Commerce Dept is proposing tiered licensing starting Q3 2026 [2]; (3) Blackwell Ultra supply and yield through H1 FY27 [3].",
              citations: [
                { sourceId: "nvda-10k-fy26", passageId: "p3", label: "1" },
                { sourceId: "nvda-news-2", passageId: "p1", label: "2" },
                { sourceId: "nvda-10k-fy26", passageId: "p2", label: "3" },
              ],
            },
          ],
        },
      }),
    },
    {
      match: (q) => /customer|concentration|mix|top.*customer|hyperscaler/i.test(q),
      respond: () => ({
        message: {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          blocks: [
            {
              kind: "text",
              text:
                "Customer concentration remains elevated: the top four customers accounted for roughly 46% of FY26 revenue [1]. That's a double-edged sword — it telegraphs demand visibility but leaves the stock levered to hyperscaler capex cycles.",
              citations: [{ sourceId: "nvda-10k-fy26", passageId: "p3", label: "1" }],
            },
          ],
        },
      }),
    },
  ],
  fallback: () => ({
    message: {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      blocks: [
        {
          kind: "text",
          text:
            "This is a prototype — I can answer from a small set of canned NVIDIA questions. Try one of the suggested prompts.",
        },
      ],
    },
  }),
};

const SCRIPTS: Record<string, TickerScript> = {
  GOOGL: GOOGL_SCRIPT,
  NVDA: NVDA_SCRIPT,
};

export function getQuickReplies(ticker: string) {
  return SCRIPTS[ticker.toUpperCase()]?.quickReplies ?? [
    { prompt: `Summarize the most recent filing for ${ticker}`, label: "Summarize filings" },
    { prompt: `What are the top risks for ${ticker}?`, label: "Top risks" },
  ];
}

export function respondTo(ticker: string, userQuery: string): ScriptedResponse {
  const script = SCRIPTS[ticker.toUpperCase()];
  if (!script) {
    return {
      message: {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        blocks: [
          {
            kind: "text",
            text: `No scripted answers for ${ticker} yet — this is a demo ticker. The prototype ships with canned Q&A for GOOGL and NVDA.`,
          },
        ],
      },
    };
  }
  const hit = script.responders.find((r) => r.match(userQuery));
  return hit ? hit.respond() : script.fallback();
}


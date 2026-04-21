export type SourceCategory =
  | "SEC Filings"
  | "Quarterly Reports"
  | "Recent News"
  | "Bespoke";

export type SourceStatus = "ready" | "processing" | "error";

export interface SourcePassage {
  id: string;
  text: string;
}

export interface Source {
  id: string;
  title: string;
  category: SourceCategory;
  status: SourceStatus;
  date: string;
  passages: SourcePassage[];
}

export interface Citation {
  sourceId: string;
  passageId: string;
  label: string;
}

export type ChatBlock =
  | { kind: "text"; text: string; citations?: Citation[] }
  | { kind: "table"; artifactId: string }
  | { kind: "chart"; artifactId: string };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  blocks: ChatBlock[];
}

export interface Insight {
  label: string;
  value: string;
  delta?: string;
  tone?: "positive" | "negative" | "neutral";
}

export interface RiskItem {
  title: string;
  detail: string;
}

export interface TickerInsights {
  metrics: Insight[];
  risks: RiskItem[];
}

export type ArtifactKind = "table" | "text" | "visual";

interface ArtifactBase {
  id: string;
  kind: ArtifactKind;
  title: string;
  createdAt: string;
  ticker: string;
}

export interface TableArtifactData extends ArtifactBase {
  kind: "table";
  columns: string[];
  rows: (string | number)[][];
  caption?: string;
}

export interface TextArtifactData extends ArtifactBase {
  kind: "text";
  body: string;
  tone?: "summary" | "bull" | "bear" | "memo";
}

export interface VisualArtifactData extends ArtifactBase {
  kind: "visual";
  series: { label: string; values: number[] }[];
  xLabels: string[];
  chartType: "line" | "bar" | "sparkline";
}

export type Artifact = TableArtifactData | TextArtifactData | VisualArtifactData;

export interface Ticker {
  symbol: string;
  name: string;
  exchange: string;
}

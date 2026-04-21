"use client";

import { create } from "zustand";
import type { Artifact, ChatMessage, Source } from "@/lib/types";
import { getSourcesForTicker } from "@/lib/mock/sources";
import { getSeedArtifacts } from "@/lib/mock/artifacts";
import { respondTo } from "@/lib/mock/chat";

export type ArtifactTab = "overview" | "tables" | "text" | "visuals" | "all";

export interface TickerState {
  symbol: string;
  sources: Source[];
  processingDone: boolean;
  messages: ChatMessage[];
  artifacts: Artifact[];
  pinnedSourceId: string | null;
  highlightedPassageId: string | null;
  activeArtifactTab: ArtifactTab;
  pulseArtifactId: string | null;
  isThinking: boolean;
}

interface WorkspaceState {
  openTickers: string[];
  activeTicker: string | null;
  byTicker: Record<string, TickerState>;

  openTicker: (symbol: string) => void;
  closeTicker: (symbol: string) => void;
  setActiveTicker: (symbol: string) => void;

  finishProcessing: (symbol: string) => void;
  pinSource: (symbol: string, sourceId: string, passageId?: string) => void;
  clearPin: (symbol: string) => void;
  setArtifactTab: (symbol: string, tab: ArtifactTab) => void;

  sendUserMessage: (symbol: string, text: string) => Promise<void>;
  clearPulse: (symbol: string) => void;
  addSource: (symbol: string, source: Source) => void;
}

function initialTickerState(symbol: string): TickerState {
  const up = symbol.toUpperCase();
  const sources = getSourcesForTicker(up);
  const artifacts = getSeedArtifacts(up);
  const greetingId = `assistant-greet-${up}`;
  return {
    symbol: up,
    sources,
    processingDone: false,
    messages: [
      {
        id: greetingId,
        role: "assistant",
        blocks: [
          {
            kind: "text",
            text: `Workspace built for ${up}. ${sources.length} sources loaded. Ask me about recent results, risks, segments, or trends — or try a suggested prompt below.`,
          },
        ],
      },
    ],
    artifacts,
    pinnedSourceId: null,
    highlightedPassageId: null,
    activeArtifactTab: "overview",
    pulseArtifactId: null,
    isThinking: false,
  };
}

export const useWorkspace = create<WorkspaceState>((set, get) => ({
  openTickers: [],
  activeTicker: null,
  byTicker: {},

  openTicker: (symbol) => {
    const up = symbol.toUpperCase();
    const state = get();
    if (state.byTicker[up]) {
      set({ activeTicker: up });
      return;
    }
    set({
      openTickers: state.openTickers.includes(up)
        ? state.openTickers
        : [...state.openTickers, up],
      activeTicker: up,
      byTicker: { ...state.byTicker, [up]: initialTickerState(up) },
    });

    // Simulate processing (PRD 3.2)
    setTimeout(() => {
      get().finishProcessing(up);
    }, 2200);
  },

  closeTicker: (symbol) => {
    const up = symbol.toUpperCase();
    const { openTickers, byTicker, activeTicker } = get();
    const remaining = openTickers.filter((s) => s !== up);
    const nextByTicker = { ...byTicker };
    delete nextByTicker[up];
    set({
      openTickers: remaining,
      byTicker: nextByTicker,
      activeTicker:
        activeTicker === up ? remaining[remaining.length - 1] ?? null : activeTicker,
    });
  },

  setActiveTicker: (symbol) => set({ activeTicker: symbol.toUpperCase() }),

  finishProcessing: (symbol) => {
    const up = symbol.toUpperCase();
    set((state) => {
      const t = state.byTicker[up];
      if (!t || t.processingDone) return state;
      const updatedSources = t.sources.map((s) =>
        s.status === "processing" ? s : { ...s, status: "ready" as const },
      );
      return {
        byTicker: {
          ...state.byTicker,
          [up]: { ...t, processingDone: true, sources: updatedSources },
        },
      };
    });
  },

  pinSource: (symbol, sourceId, passageId) => {
    const up = symbol.toUpperCase();
    set((state) => {
      const t = state.byTicker[up];
      if (!t) return state;
      return {
        byTicker: {
          ...state.byTicker,
          [up]: {
            ...t,
            pinnedSourceId: sourceId,
            highlightedPassageId: passageId ?? null,
          },
        },
      };
    });
    // Auto-clear highlight animation state after a few seconds.
    if (passageId) {
      setTimeout(() => {
        set((state) => {
          const t = state.byTicker[up];
          if (!t || t.highlightedPassageId !== passageId) return state;
          return {
            byTicker: {
              ...state.byTicker,
              [up]: { ...t, highlightedPassageId: null },
            },
          };
        });
      }, 3000);
    }
  },

  clearPin: (symbol) => {
    const up = symbol.toUpperCase();
    set((state) => {
      const t = state.byTicker[up];
      if (!t) return state;
      return {
        byTicker: {
          ...state.byTicker,
          [up]: { ...t, pinnedSourceId: null, highlightedPassageId: null },
        },
      };
    });
  },

  setArtifactTab: (symbol, tab) => {
    const up = symbol.toUpperCase();
    set((state) => {
      const t = state.byTicker[up];
      if (!t) return state;
      return {
        byTicker: {
          ...state.byTicker,
          [up]: { ...t, activeArtifactTab: tab },
        },
      };
    });
  },

  sendUserMessage: async (symbol, text) => {
    const up = symbol.toUpperCase();
    const userId = `user-${Date.now()}`;
    set((state) => {
      const t = state.byTicker[up];
      if (!t) return state;
      return {
        byTicker: {
          ...state.byTicker,
          [up]: {
            ...t,
            messages: [
              ...t.messages,
              {
                id: userId,
                role: "user",
                blocks: [{ kind: "text", text }],
              },
            ],
            isThinking: true,
          },
        },
      };
    });

    await new Promise((r) => setTimeout(r, 650));

    const { message, artifacts: extra } = respondTo(up, text);

    // Detect artifact references in the assistant's message blocks
    // to surface the corresponding artifact card + pulse.
    const { byTicker } = get();
    const t = byTicker[up];
    if (!t) return;

    const referencedArtifactIds = message.blocks
      .map((b) => ("artifactId" in b ? b.artifactId : null))
      .filter((id): id is string => !!id);

    const existingIds = new Set(t.artifacts.map((a) => a.id));
    const newArtifacts = [...(extra ?? [])].filter((a) => !existingIds.has(a.id));

    // Ensure referenced artifacts exist (they're seeded for GOOGL/NVDA); otherwise ignore.
    const pulseId = referencedArtifactIds[0] ?? newArtifacts[0]?.id ?? null;
    const nextTab: ArtifactTab | null = pulseId
      ? ((): ArtifactTab => {
          const found = [...t.artifacts, ...newArtifacts].find((a) => a.id === pulseId);
          if (!found) return t.activeArtifactTab;
          if (found.kind === "table") return "tables";
          if (found.kind === "text") return "text";
          if (found.kind === "visual") return "visuals";
          return t.activeArtifactTab;
        })()
      : t.activeArtifactTab;

    set((state) => {
      const cur = state.byTicker[up];
      if (!cur) return state;
      return {
        byTicker: {
          ...state.byTicker,
          [up]: {
            ...cur,
            messages: [...cur.messages, message],
            artifacts: [...cur.artifacts, ...newArtifacts],
            pulseArtifactId: pulseId,
            activeArtifactTab: nextTab ?? cur.activeArtifactTab,
            isThinking: false,
          },
        },
      };
    });

    if (pulseId) {
      setTimeout(() => get().clearPulse(up), 1800);
    }
  },

  clearPulse: (symbol) => {
    const up = symbol.toUpperCase();
    set((state) => {
      const t = state.byTicker[up];
      if (!t) return state;
      return {
        byTicker: { ...state.byTicker, [up]: { ...t, pulseArtifactId: null } },
      };
    });
  },

  addSource: (symbol, source) => {
    const up = symbol.toUpperCase();
    set((state) => {
      const t = state.byTicker[up];
      if (!t) return state;
      return {
        byTicker: {
          ...state.byTicker,
          [up]: { ...t, sources: [...t.sources, source] },
        },
      };
    });
  },
}));

export function useActiveTickerState(): TickerState | null {
  const active = useWorkspace((s) => s.activeTicker);
  const byTicker = useWorkspace((s) => s.byTicker);
  return active ? byTicker[active] ?? null : null;
}

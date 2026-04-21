"use client";

import type { Artifact } from "@/lib/types";
import { ArtifactCard } from "./ArtifactCard";
import { EmptyArtifactState } from "./EmptyArtifactState";

type EmptyKind = "table" | "text" | "visual" | "all";

export function ArtifactList({
  artifacts,
  pulseId,
  emptyKind,
}: {
  artifacts: Artifact[];
  pulseId: string | null;
  emptyKind: EmptyKind;
}) {
  if (artifacts.length === 0) {
    return <EmptyArtifactState kind={emptyKind} />;
  }

  return (
    <div className="p-3 space-y-2">
      {artifacts.map((a) => (
        <ArtifactCard key={a.id} artifact={a} pulse={a.id === pulseId} />
      ))}
    </div>
  );
}

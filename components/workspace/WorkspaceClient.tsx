"use client";

import { useEffect } from "react";
import { useWorkspace } from "@/lib/store/workspace-store";
import { WorkspaceShell } from "./WorkspaceShell";

export default function WorkspaceClient({
  initialTicker,
}: {
  initialTicker: string;
}) {
  const openTicker = useWorkspace((s) => s.openTicker);

  useEffect(() => {
    openTicker(initialTicker);
  }, [initialTicker, openTicker]);

  return <WorkspaceShell />;
}

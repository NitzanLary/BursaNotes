"use client";

import { useWorkspace } from "@/lib/store/workspace-store";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TopBar } from "./TopBar";
import { LeftPane } from "./LeftPane/LeftPane";
import { CenterPane } from "./CenterPane/CenterPane";
import { ArtifactsPane } from "./RightPane/ArtifactsPane";

export function WorkspaceShell() {
  const activeTicker = useWorkspace((s) => s.activeTicker);

  return (
    <div className="flex flex-col h-svh min-h-svh w-full bg-background">
      <TopBar />
      <div className="flex-1 min-h-0 min-[1280px]:flex hidden">
        {activeTicker ? (
          <ResizablePanelGroup
            orientation="horizontal"
            id="bursanotes-workspace-panels"
            className="flex-1"
          >
            <ResizablePanel
              defaultSize="22%"
              minSize="16%"
              maxSize="35%"
              className="bg-sidebar"
            >
              <LeftPane />
            </ResizablePanel>
            <ResizableHandle className="bg-border/60" />
            <ResizablePanel defaultSize="48%" minSize="32%">
              <CenterPane />
            </ResizablePanel>
            <ResizableHandle className="bg-border/60" />
            <ResizablePanel
              defaultSize="30%"
              minSize="22%"
              maxSize="45%"
              className="bg-sidebar"
            >
              <ArtifactsPane />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Loading workspace…
          </div>
        )}
      </div>
      <div className="flex-1 min-[1280px]:hidden flex items-center justify-center p-8 text-center">
        <div className="max-w-sm space-y-2">
          <div className="text-sm font-medium">Desktop recommended</div>
          <p className="text-xs text-muted-foreground">
            BursaNotes is designed for screens 1280px and wider. Please resize
            your window or open on a larger display.
          </p>
        </div>
      </div>
    </div>
  );
}

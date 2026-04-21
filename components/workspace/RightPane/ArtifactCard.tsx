"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Table as TableIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { Artifact } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/workspace/CenterPane/Sparkline";

export function ArtifactCard({
  artifact,
  pulse,
}: {
  artifact: Artifact;
  pulse: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pulse && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [pulse]);

  const { Icon, meta } = kindMeta(artifact);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-surface overflow-hidden",
        pulse && "artifact-pulse ring-1 ring-primary/50",
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-muted/30 transition"
      >
        <Icon className="h-4 w-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium truncate">{artifact.title}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {meta}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border/60 p-3 space-y-3">
          <ArtifactBody artifact={artifact} />
          <ExportActions artifact={artifact} />
        </div>
      )}
    </div>
  );
}

function ArtifactBody({ artifact }: { artifact: Artifact }) {
  if (artifact.kind === "table") {
    return (
      <div className="overflow-x-auto -mx-3 px-3">
        <table className="w-full text-[11.5px]">
          <thead>
            <tr>
              {artifact.columns.map((c) => (
                <th
                  key={c}
                  className="text-left px-2 py-1.5 font-medium text-muted-foreground border-b border-border"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {artifact.rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-2 py-1.5 tabular-nums">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (artifact.kind === "text") {
    return (
      <div className="text-[12.5px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {artifact.body}
      </div>
    );
  }
  return (
    <Sparkline
      series={artifact.series}
      xLabels={artifact.xLabels}
      chartType={artifact.chartType}
      height={120}
    />
  );
}

function ExportActions({ artifact }: { artifact: Artifact }) {
  const actions: { label: string; icon: typeof Download; toast: string }[] =
    artifact.kind === "table"
      ? [
          { label: "Excel", icon: Download, toast: "Exported to Excel (demo)" },
          { label: "Copy", icon: Copy, toast: "Copied table (demo)" },
        ]
      : artifact.kind === "text"
        ? [
            { label: "Copy", icon: Copy, toast: "Copied summary to clipboard (demo)" },
            { label: "Slide", icon: ImageIcon, toast: "Exported to slide (demo)" },
          ]
        : [
            { label: "PNG", icon: ImageIcon, toast: "Exported as PNG (demo)" },
            { label: "Slide", icon: Download, toast: "Exported to slide (demo)" },
          ];

  return (
    <div className="flex items-center gap-1.5 pt-1">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => toast.success(a.toast)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border border-border hover:border-primary/60 hover:text-primary transition"
        >
          <a.icon className="h-3 w-3" />
          {a.label}
        </button>
      ))}
    </div>
  );
}

function kindMeta(a: Artifact): { Icon: typeof TableIcon; meta: string } {
  if (a.kind === "table")
    return { Icon: TableIcon, meta: `Table · ${a.rows.length} rows` };
  if (a.kind === "text") return { Icon: FileText, meta: a.tone ?? "Memo" };
  return { Icon: BarChart3, meta: `${a.chartType} chart` };
}

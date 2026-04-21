"use client";

import { Download, Table as TableIcon } from "lucide-react";
import { toast } from "sonner";
import type { TableArtifactData } from "@/lib/types";

export function InlineTable({ artifact }: { artifact: TableArtifactData }) {
  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden max-w-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 text-xs font-medium">
          <TableIcon className="h-3.5 w-3.5 text-primary" />
          {artifact.title}
        </div>
        <button
          onClick={() => toast.success("Exported to Excel (demo)")}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition"
        >
          <Download className="h-3 w-3" />
          Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-muted/20">
              {artifact.columns.map((c) => (
                <th
                  key={c}
                  className="text-left px-3 py-2 font-medium text-muted-foreground border-b border-border"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {artifact.rows.map((row, i) => (
              <tr key={i} className="border-b border-border/60 last:border-0">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="px-3 py-1.5 tabular-nums text-foreground/90"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {artifact.caption && (
        <div className="px-3 py-1.5 text-[11px] text-muted-foreground border-t border-border/60">
          {artifact.caption}
        </div>
      )}
    </div>
  );
}

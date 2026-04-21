"use client";

interface Props {
  series: { label: string; values: number[] }[];
  xLabels: string[];
  chartType: "line" | "bar" | "sparkline";
  height?: number;
  showLabels?: boolean;
}

export function Sparkline({
  series,
  xLabels,
  chartType,
  height = 80,
  showLabels = true,
}: Props) {
  const all = series.flatMap((s) => s.values);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const count = xLabels.length;

  const pad = { top: 12, right: 12, bottom: showLabels ? 22 : 6, left: 32 };
  const W = 560;
  const H = height;
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const xFor = (i: number) =>
    pad.left + (count <= 1 ? innerW / 2 : (i / (count - 1)) * innerW);
  const yFor = (v: number) =>
    pad.top + innerH - ((v - min) / range) * innerH;

  const gridLines = 3;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
      {[...Array(gridLines + 1)].map((_, i) => {
        const y = pad.top + (innerH * i) / gridLines;
        const v = max - (range * i) / gridLines;
        return (
          <g key={i}>
            <line
              x1={pad.left}
              x2={W - pad.right}
              y1={y}
              y2={y}
              stroke="currentColor"
              className="text-border"
              strokeDasharray="2 3"
            />
            <text
              x={pad.left - 6}
              y={y + 3}
              textAnchor="end"
              className="fill-muted-foreground text-[9px] tabular-nums"
            >
              {formatTick(v)}
            </text>
          </g>
        );
      })}

      {series.map((s, si) => {
        if (chartType === "bar") {
          const barW = (innerW / count) * 0.6;
          return (
            <g key={si}>
              {s.values.map((v, i) => {
                const x = xFor(i) - barW / 2;
                const y = yFor(v);
                const h = pad.top + innerH - y;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barW}
                    height={h}
                    className="fill-primary/80"
                    rx={2}
                  />
                );
              })}
            </g>
          );
        }
        const d = s.values
          .map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(v)}`)
          .join(" ");
        const areaD =
          d +
          ` L${xFor(count - 1)},${pad.top + innerH} L${xFor(0)},${pad.top + innerH} Z`;
        return (
          <g key={si}>
            <path d={areaD} className="fill-primary/10" />
            <path
              d={d}
              fill="none"
              className="stroke-primary"
              strokeWidth={1.75}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {s.values.map((v, i) => (
              <circle
                key={i}
                cx={xFor(i)}
                cy={yFor(v)}
                r={2}
                className="fill-primary"
              />
            ))}
          </g>
        );
      })}

      {showLabels &&
        xLabels.map((l, i) => (
          <text
            key={i}
            x={xFor(i)}
            y={H - 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            {l}
          </text>
        ))}
    </svg>
  );
}

function formatTick(v: number) {
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`;
  if (Math.abs(v) >= 100) return v.toFixed(0);
  if (Math.abs(v) >= 10) return v.toFixed(1);
  return v.toFixed(2);
}

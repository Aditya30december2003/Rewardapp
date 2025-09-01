export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { CalendarIcon } from "@heroicons/react/24/outline";
import { fetchUserLeadsAnalytics } from "@/lib/data";
import { generateYAxis } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function RevenueChart() {
  cookies();

  // Fetch analytics (may return object or array depending on your fetcher)
  const analytics = await fetchUserLeadsAnalytics();

  // Normalize into an array of { month, userRegistrations }
  const rows = Array.isArray(analytics)
    ? analytics
    : Array.isArray(analytics?.monthly)
      ? analytics.monthly
      : [];

  const series = rows.map((m, i) => ({
    month: m?.month ?? m?.label ?? m?.name ?? `M${i + 1}`,
    userRegistrations: Number(
      m?.userRegistrations ?? m?.count ?? m?.value ?? 0
    ) || 0,
  }));

  // Early out if nothing to show
  if (series.length === 0) {
    return (
      <div className="w-full md:col-span-4">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-gray-900 dark:ring-gray-800">
          <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200/80 bg-slate-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-800/40">
            <h3 className="text-xs md:text-sm font-medium leading-5 text-slate-700 dark:text-slate-200">
              Lead Analytics
            </h3>
          </div>
          <p className="px-4 py-6 text-gray-400">No data available.</p>
        </div>
      </div>
    );
  }

  // Y-axis from utils (already hardened)
  const { yAxisLabels, topLabel } = generateYAxis(series);

  // Chart layout
  const n = series.length;
  const margin = { top: 24, right: 16, bottom: 48, left: 48 };
  const height = 360;
  const width = Math.max(760, n * 64 + margin.left + margin.right);
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const maxY = Math.max(topLabel || 0, 1);

  const step = innerW / n;
  const barW = Math.min(38, step * 0.62);
  const xAt = (i) => margin.left + i * step + (step - barW) / 2;
  const yAt = (v) => margin.top + (innerH - (Number(v) / maxY) * innerH);

  return (
    <div style={{ marginTop: '1%' }} className="flex w-full flex-col md:col-span-4">
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-gray-900 dark:ring-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200/80 bg-slate-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-800/40">
          <h3 className="text-xs md:text-sm font-medium leading-5 text-slate-700 dark:text-slate-200">
            Lead Analytics
          </h3>
        </div>

        {/* Chart */}
        <div className="relative w-full overflow-x-auto px-4 pt-3">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[360px] w-full"
            role="img"
            aria-label="Lead Analytics"
          >
            <defs>
              <linearGradient id="barOrange" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ff8a3c" />
                <stop offset="100%" stopColor="#ff6b00" />
              </linearGradient>
              <linearGradient id="barGloss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <style>{`
                .gridline { color: rgba(148,163,184,0.22); }
                .axisText { fill: #64748b; }
                @media (prefers-color-scheme: dark) {
                  .gridline { color: rgba(148,163,184,0.28); }
                  .axisText { fill: #cbd5e1; }
                }
              `}</style>
            </defs>

            {/* Plot area */}
            <rect
              x={margin.left}
              y={margin.top}
              width={innerW}
              height={innerH}
              rx="14"
              className="fill-white dark:fill-gray-900"
              stroke="currentColor"
              style={{ color: "rgba(226,232,240,0.7)" }}
            />

            {/* Horizontal gridlines + labels */}
            {yAxisLabels.map((lab) => {
              const y = yAt(lab);
              return (
                <g key={`y-${lab}`}>
                  <line
                    x1={margin.left}
                    x2={margin.left + innerW}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="gridline"
                    strokeDasharray="3 6"
                  />
                  <text
                    x={margin.left - 12}
                    y={y + 5}
                    textAnchor="end"
                    className="axisText"
                    fontSize="14"
                  >
                    {lab}
                  </text>
                </g>
              );
            })}

            {/* Vertical gridlines every 3 bars */}
            {series.map((_, i) => {
              const x = xAt(i) + barW / 2;
              if ((i + 1) % 3 !== 0) return null;
              return (
                <line
                  key={`v-${i}`}
                  x1={x}
                  x2={x}
                  y1={margin.top}
                  y2={margin.top + innerH}
                  stroke="currentColor"
                  className="gridline"
                  strokeDasharray="3 6"
                />
              );
            })}

            {/* Bars */}
            {series.map((m, i) => {
              const v = m.userRegistrations;
              const x = xAt(i);
              const y = yAt(v);
              const h = Math.max(margin.top + innerH - y, 2);
              const cx = x + barW / 2;

              return (
                <g key={`bar-${m.month}-${i}`}>
                  <rect x={x} y={y} width={barW} height={h} rx="6" fill="url(#barOrange)">
                    <title>{`${m.month}: ${v.toLocaleString()}`}</title>
                  </rect>
                  <rect x={x} y={y} width={barW} height={Math.min(16, h)} rx="6" fill="url(#barGloss)" />
                  <text
                    x={cx}
                    y={height - margin.bottom + 20}
                    textAnchor="middle"
                    className="axisText"
                    fontSize="14"
                  >
                    {m.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between px-4 pb-4">
          <div className="flex items-center text-slate-500">
            <CalendarIcon className="h-5 w-5 text-slate-400" />
            <span className="ml-2 text-sm">Last 12 months</span>
          </div>
        </div>
      </div>
    </div>
  );
}

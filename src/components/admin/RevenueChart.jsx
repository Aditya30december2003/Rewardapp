// lib/data and lib/utils are assumed to be the same
import { fetchLeadsAnalytics } from "@/lib/data";
import { generateYAxis } from "@/lib/utils";
import { ChartBarSquareIcon } from "@heroicons/react/24/outline";
import { cookies } from "next/headers";

export default async function LeadsAnalyticsChart() {
  // Disable caching to always fetch fresh data
  cookies();

  const analyticsData = await fetchLeadsAnalytics();

  if (!analyticsData || analyticsData.length === 0) {
    return (
      <div className="w-full md:col-span-4 flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg">
        <p className="text-lg font-medium text-slate-500">No Analytics Data Available</p>
        <p className="mt-2 text-sm text-slate-400">
          We couldn't find any lead data for the last 12 months.
        </p>
      </div>
    );
  }

  const { yAxisLabels, topLabel } = generateYAxis(analyticsData);
  const chartHeight = 350;

  return (
    <div className="w-full md:col-span-4">
      <div className="rounded-xl bg-white shadow-lg sm:p-0 overflow-hidden">
        {/* ===== Compact Header ===== */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200/80 bg-slate-50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-800/40">
          <h3 className="text-xs md:text-sm font-medium leading-5 text-slate-700 dark:text-slate-200">
            Leads Analytics
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400">
            <ChartBarSquareIcon className="h-4 w-4" />
            Last 12 months
          </span>
        </div>

        {/* ===== Chart Area ===== */}
        <div className="p-4">
          <div className="mt-2 flex w-full items-end gap-2 sm:gap-4">
            {/* Y-Axis Labels */}
            <div
              className="mb-6 hidden flex-col justify-between text-right text-sm text-slate-400 sm:flex"
              style={{ height: `${chartHeight}px` }}
            >
              {yAxisLabels.map((label) => (
                <p key={label}>{label}</p>
              ))}
            </div>

            {/* Bars + Grid */}
            <div className="grid h-full w-full grid-cols-12 items-end gap-2 rounded-md bg-slate-50 p-4 sm:gap-4">
              {/* Background Grid Lines */}
              {yAxisLabels.map((_, index) => (
                <div
                  key={index}
                  className="col-span-12 w-full border-t border-dashed border-slate-200"
                  style={{ gridRow: `${yAxisLabels.length - index} / span 1` }}
                />
              ))}

              {/* Foreground Bars */}
              {analyticsData.map((dataPoint) => (
                <div
                  key={dataPoint.month}
                  className="group relative flex flex-col items-center gap-2"
                  style={{ gridColumn: "auto / span 1" }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 w-max scale-95 opacity-0 transition-all duration-200 ease-in-out group-hover:scale-100 group-hover:opacity-100">
                    <span className="rounded-md bg-slate-800 px-2 py-1 text-xs font-bold text-white">
                      {dataPoint.userRegistrations} Leads
                    </span>
                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-slate-800" />
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all duration-300 ease-in-out group-hover:from-indigo-600 group-hover:to-indigo-500"
                    style={{
                      height: `${(chartHeight / topLabel) * dataPoint.userRegistrations}px`,
                    }}
                  />

                  {/* X-Axis Label */}
                  <p className="w-full text-center text-sm font-medium text-slate-500">
                    {dataPoint.month}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

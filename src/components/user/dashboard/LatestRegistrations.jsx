import { fetchLatestRegistrations, fetchUserLatestRegistrations } from '@/lib/data';
import { maskEmail } from '@/lib/utils';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { cookies } from 'next/headers';
import Image from 'next/image';

export default async function LatestRegistrations() {
  cookies();
  const latestRegistrations = await fetchUserLatestRegistrations();

  const total = latestRegistrations?.length || 0;
  const showingFrom = total > 0 ? 1 : 0;
  const showingTo = total;

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div
        style={{ marginTop: '1%' }}
        className="flex grow flex-col justify-between rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-gray-900 dark:ring-gray-800"
      >
        {/* Small, simple heading inside the card */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200/80 bg-slate-50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-800/40">
          <h3 className="text-xs md:text-sm font-medium leading-5 text-slate-700 dark:text-slate-200">
            Recent Registrations
          </h3>
        </div>

        {/* Desktop/tablet table */}
        <div className="hidden md:block">
          <div className="relative overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 backdrop-blur dark:bg-gray-800/60 dark:text-slate-200">
                  <th className="sticky top-0 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide">
                    Name
                  </th>
                  <th className="sticky top-0 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide">
                    Email
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {latestRegistrations?.map((invoice, i) => (
                  <tr
                    key={invoice.$id}
                    className={clsx(
                      'transition-colors',
                      i % 2 === 1
                        ? 'bg-slate-50/60 dark:bg-gray-800/40'
                        : 'bg-white dark:bg-gray-900',
                      'hover:bg-sky-50/70 dark:hover:bg-sky-900/20'
                    )}
                  >
                    <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-100">
                      {invoice.firstName}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-[13px] font-medium text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800/60">
                        {maskEmail(invoice.email)}
                      </span>
                    </td>
                  </tr>
                ))}
                {total === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-5 py-6 text-center text-slate-400 dark:text-slate-500"
                    >
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile layout (stacked rows) */}
        <div className="md:hidden">
          <div className="space-y-3 p-4">
            {latestRegistrations?.map((invoice) => (
              <div
                key={invoice.$id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-transparent hover:ring-sky-300/60 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {invoice.firstName}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-[12px] font-medium text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800/60">
                    {maskEmail(invoice.email)}
                  </span>
                </div>
              </div>
            ))}
            {total === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-400 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-500">
                No data available.
              </div>
            )}
          </div>
        </div>

        {/* “Updated just now” footer */}
        <div className="flex items-center px-4 pb-3 pt-4">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}

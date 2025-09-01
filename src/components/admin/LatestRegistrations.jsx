// components/admin/LatestRegistrations.jsx
import { fetchLatestRegistrations } from "@/lib/data";
import { ArrowPathIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function LatestRegistrations() {
  // keep data fresh on each request (server component)
  cookies();

  const latestRegistrations = await fetchLatestRegistrations();

  return (
    <section className="flex w-full flex-col md:col-span-4">
      <div className="rounded-xl bg-white shadow-lg sm:p-0 overflow-hidden border">
        {/* Header — matches your compact card style */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200/80 bg-slate-50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-800/40">
          <h3 className="text-xs md:text-sm font-medium leading-5 text-slate-700 dark:text-slate-200">
            Recent Registrations
          </h3>
          <span className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400">
            Updated live
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Empty state */}
          {!latestRegistrations || latestRegistrations.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center dark:border-gray-800 dark:bg-gray-900/30">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  No recent registrations
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  New users will appear here as they sign up.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border rounded-lg dark:bg-gray-900/30 dark:border-gray-800">
              <ul role="list" className="divide-y divide-slate-200 dark:divide-gray-800">
                {latestRegistrations.map((user, i) => {
                  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
                  const initials = (user.firstName?.[0] || "U").toUpperCase();

                  return (
                    <li
                      key={user.$id || `${fullName}-${i}`}
                      className={clsx(
                        "group flex items-center justify-between gap-3 px-3 sm:px-4 py-3 sm:py-4 transition-colors",
                        "hover:bg-white hover:shadow-sm dark:hover:bg-gray-900/50"
                      )}
                    >
                      {/* Left — Avatar + Name + Email */}
                      <div className="flex min-w-0 items-center gap-3">
                        {/* Avatar (image if provided, fallback to initial) */}
                        {user.image_url ? (
                          <span className="relative inline-flex h-9 w-9 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-gray-800">
                            <Image
                              src={user.image_url}
                              alt={`${fullName || "User"}'s profile picture`}
                              width={36}
                              height={36}
                              className="object-cover"
                            />
                          </span>
                        ) : (
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/30">
                            <span className="text-sm font-semibold">{initials}</span>
                          </span>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800 md:text-base dark:text-slate-100">
                            {fullName || "Unnamed User"}
                          </p>
                          <p className="truncate text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                            {user.email || "—"}
                          </p>
                        </div>
                      </div>

                      {/* Right — Meta */}
                      <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                        {/* Country pill */}
                        {user.country ? (
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300">
                            {user.country}
                          </span>
                        ) : null}

                        {/* Company (muted) */}
                        <p className="truncate text-[11px] text-slate-500 sm:text-xs dark:text-slate-400">
                          {user.company ? `Company: ${user.company}` : "—"}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center text-slate-500 dark:text-slate-400">
            <ArrowPathIcon className="h-5 w-5" />
            <span className="ml-2 text-sm">Updated just now</span>
          </div>
        </div>
      </div>
    </section>
  );
}

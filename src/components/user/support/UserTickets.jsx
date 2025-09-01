"use client";
import { useMemo, useState } from "react";
import { createQuery } from "@/lib/actions";
import Empty from "@/components/ui/Empty";
import PopupForm from "@/components/admin/PopupForm";

const StatusDot = ({ status }) => {
  const color = status === "Unread" ? "bg-red-500" : "bg-emerald-500";
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
};

const formatDate = (iso) =>
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const UserTickets = ({ tickets = [], userId, isLoading = false }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () =>
      [...tickets].sort(
        (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
      ),
    [tickets]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(
      (t) =>
        t.subject?.toLowerCase()?.includes(q) ||
        t.description?.toLowerCase()?.includes(q) ||
        t.reply?.toLowerCase()?.includes(q)
    );
  }, [sorted, query]);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-3xl"> {/* reduced width */}
        {/* Header */}
        <div style={{marginTop:"5%"}} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              My Tickets
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View all your tickets in a simple list view.
            </p>
          </div>

          <div  className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-800 dark:bg-neutral-900 dark:text-gray-100 dark:focus:ring-indigo-400"
              />
              <span className="pointer-events-none absolute right-3 top-2.5 text-gray-400 dark:text-gray-500">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20 15.5 14zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  />
                </svg>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsPopupOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6Z" />
              </svg>
              Create Ticket
            </button>
          </div>
        </div>

        {/* Ticket List */}
        <div style={{marginTop:"5%"}} className="mt-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-neutral-900"
                >
                  <div className="mb-2 h-4 w-48 rounded bg-gray-200 dark:bg-neutral-800" />
                  <div className="h-16 rounded bg-gray-200 dark:bg-neutral-800" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Empty
                msg={
                  tickets.length === 0
                    ? "You have no tickets yet."
                    : "No tickets match your search."
                }
              />
            </div>
          ) : (
            <ul
              role="list"
              className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-neutral-900"
            >
              {filtered.map((t) => (
                <li key={t.$id} className="p-4 sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <StatusDot status={t.status} />
                        <h4 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                          {t.subject}
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(t.$createdAt)}
                      </p>
                      <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                        {t.description}
                      </p>
                      {t.status === "Read" && t.reply && (
                        <p className="mt-2 rounded-md bg-gray-50 p-3 text-sm italic text-gray-800 dark:bg-neutral-800/60 dark:text-gray-100">
                          “{t.reply}”
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 pt-1 sm:pt-0">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          t.status === "Unread"
                            ? "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-900/40"
                            : "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-900/40"
                        }`}
                      >
                        {t.status === "Unread" ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Create Ticket Popup */}
      {isPopupOpen && (
        <PopupForm
          title="Create New Ticket"
          fields={[{ fieldname: "subject", placeholder: "Enter subject", type: "text" }]}
          textareas={[{ fieldname: "description", placeholder: "Describe your issue…" }]}
          secrets={[{ fieldname: "userId", value: userId }]}
          onSubmit={createQuery}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </section>
  );
};

export default UserTickets;

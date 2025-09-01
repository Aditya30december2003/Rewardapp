"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/** Perktify FAQ data */
const DEFAULT_FAQ = [
  {
    question: "What is Perktify about?",
    answer:
      "Perktify is an all-in-one platform that provides everything you need to build, run, and scale your business. From creating stunning websites to managing customer relationships, handling payments, banking, and executing marketing strategies, our platform simplifies and enhances your business operations.",
  },
  {
    question: "How does the website builder work?",
    answer:
      "Our website builder features a user-friendly, drag-and-drop interface that allows you to design and customise your eCommerce or personal website without needing any technical skills. You can choose from a variety of templates and customise them to match your brand identity.",
  },
  {
    question: "What payment methods does the platform support?",
    answer:
      "We support a wide range of payment solutions, including credit cards, debit cards, PayPal, pay-by link, various mobile payment methods, and direct bank transfers. This allows you to cater to the preferences of a global audience and ensures smooth, secure transactions.",
  },
  {
    question: "How do I get started with Perktify?",
    answer:
      "To get started, simply sign up on our website. You'll be guided through the setup process, and you can begin using all the features of the platform right away. If you need any assistance, our support team is just a click away.",
  },
  {
    question: "Can I cancel my Perktify subscription at any time?",
    answer:
      "Yes, you can cancel your subscription at any time. We strive to make Perktify as flexible and risk-free as possible for our users.",
  },
];

// Stars icon component
const StarsIcon = ({ className = "h-4 w-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

/**
 * FAQ2 – Enhanced, accessible, pretty.
 *
 * Props (optional):
 * - items?: { question: string; answer: string }[]   // defaults to DEFAULT_FAQ
 * - title?: string                                   // default: "Frequently asked questions"
 * - allowMultiple?: boolean                          // default: false
 * - defaultOpen?: number                             // default: 0 (use -1 for none)
 * - className?: string                               // wrapper classes
 */
export default function FAQ2({
  items = DEFAULT_FAQ,
  title = "Frequently asked questions",
  allowMultiple = false,
  defaultOpen = 0,
  className = "",
}) {
  const [query, setQuery] = useState("");
  const [openSet, setOpenSet] = useState(
    () => new Set(defaultOpen === -1 ? [] : [defaultOpen])
  );
  const listRef = useRef(null);

  // Filter by query
  const filtered = useMemo(() => {
    if (!query.trim()) return items.map((it, i) => ({ ...it, _idx: i }));
    const q = query.trim().toLowerCase();
    return items
      .map((it, i) => ({ ...it, _idx: i }))
      .filter(
        (it) =>
          it.question.toLowerCase().includes(q) ||
          it.answer.toLowerCase().includes(q)
      );
  }, [items, query]);

  // Open via hash (e.g. #faq2-q-3)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const match = window.location.hash.match(/#faq2-q-(\d+)/);
    if (match) {
      const idx = Number(match[1]);
      if (!Number.isNaN(idx)) {
        setOpenSet(new Set([idx]));
        setTimeout(() => {
          document.getElementById(`faq2-header-${idx}`)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 0);
      }
    }
  }, []);

  const isOpen = (i) => openSet.has(i);

  const toggle = (i) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        if (!allowMultiple) next.clear();
        next.add(i);
      }
      return next;
    });
  };

  const expandAll = () => setOpenSet(new Set(items.map((_, i) => i)));
  const collapseAll = () => setOpenSet(new Set());

  const copyLink = async (i) => {
    const hash = `#faq2-q-${i}`;
    try {
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}${hash}`
          : hash;
      await navigator.clipboard.writeText(url);
      toast("Copied link to clipboard");
    } catch {
      toast("Unable to copy. Long-press to copy the link.");
    }
  };

  // Tiny toast (no dependency)
  const toast = (msg) => {
    if (typeof document === "undefined") return;
    const el = document.createElement("div");
    el.textContent = msg;
    el.className =
      "fixed left-1/2 -translate-x-1/2 bottom-6 z-50 px-3 py-2 rounded-lg text-sm shadow-lg " +
      "bg-gray-900/90 text-white dark:bg-white/90 dark:text-gray-900";
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity .3s ease";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 300);
    }, 1200);
  };

  const Highlight = ({ text }) => {
    if (!query.trim()) return text;
    const q = query.trim();
    const parts = String(text).split(new RegExp(`(${escapeRegExp(q)})`, "ig"));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark
          key={i}
          className="rounded px-0.5 bg-amber-200/70 dark:bg-amber-400/30"
        >
          {part}
        </mark>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    );
  };

  return (
    <section
      id="faq2"
      className={`flex justify-center items-center min-h-screen py-12 px-4 ${className}`}
      aria-labelledby="faq2-title"
    >
      <div className="w-full max-w-3xl mx-auto">
        {/* Enhanced Header */}
        <div className="relative mx-auto mb-16 max-w-3xl text-center" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50">
            <StarsIcon className="h-4 w-4" /> FAQ
          </span>
          <h2
            id="faq2-title"
            className="mt-3 text-4xl font-extrabold leading-tight text-slate-900 dark:text-white md:text-5xl"
          >
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Find quick answers to common questions about Perktify. Search to find what you need.
          </p>
          {/* subtle underline flourish */}
          <svg className="mx-auto mt-5 h-6 w-56 text-indigo-400/40" viewBox="0 0 224 24" fill="none">
            <path
              d="M2 12 C40 2 80 2 112 12 C144 22 184 22 222 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="svg-draw"
            />
          </svg>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8 p-6 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-sm">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              aria-label="Search FAQs"
              className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 backdrop-blur px-5 py-4 pr-12 outline-none focus:ring-3 focus:ring-indigo-500/30 focus:border-transparent transition-all duration-300"
            />
            <svg
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="rounded-xl px-4 py-3 text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:bg-gray-50 dark:hover:bg-gray-800 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className="rounded-xl px-4 py-3 text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:bg-gray-50 dark:hover:bg-gray-800 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* List */}
        <ul ref={listRef} className="space-y-5">
          {filtered.length === 0 && (
            <li className="text-center py-16 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
              <div className="mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No results for <b>"{query}"</b>. Try a different keyword.
              </p>
            </li>
          )}

          {filtered.map((it) => {
            const i = it._idx;
            const open = isOpen(i);
            return (
              <li key={i} className="group">
                {/* Gradient frame */}
                <div className="rounded-2xl bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-rose-500/20 p-[1.5px] transition-all duration-500 hover:from-indigo-500/30 hover:via-fuchsia-500/30 hover:to-rose-500/30">
                  <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <button
                      id={`faq2-header-${i}`}
                      aria-controls={`faq2-panel-${i}`}
                      aria-expanded={open}
                      onClick={() => toggle(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(i);
                        }
                        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                          e.preventDefault();
                          const buttons = listRef.current?.querySelectorAll(
                            "button[aria-controls^='faq2-panel-']"
                          );
                          if (!buttons?.length) return;
                          const idx = [...buttons].findIndex(
                            (b) => b.id === `faq2-header-${i}`
                          );
                          const nextIdx =
                            e.key === "ArrowDown"
                              ? Math.min(idx + 1, buttons.length - 1)
                              : Math.max(idx - 1, 0);
                          buttons[nextIdx]?.focus();
                        }
                      }}
                      className="w-full text-left px-6 py-5 flex items-start gap-4 transition-all duration-300 hover:bg-white/30 dark:hover:bg-gray-800/30"
                    >
                      <span
                        className={`mt-1 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full transition-all duration-300 ${
                          open
                            ? "rotate-180 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          className="h-4 w-4 transition-transform duration-300"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <path d="M6 8l4 4 4-4" />
                        </svg>
                      </span>

                      <span className="flex-1">
                        <h3 className="m-0 text-lg font-semibold leading-snug text-gray-800 dark:text-gray-100">
                          <Highlight text={it.question} />
                        </h3>

                        {/* Smooth collapse (CSS grid rows trick) */}
                        <div
                          id={`faq2-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq2-header-${i}`}
                          className={`grid overflow-hidden transition-all duration-500 ${
                            open
                              ? "grid-rows-[1fr] opacity-100 mt-4"
                              : "grid-rows-[0fr] opacity-0 mt-0"
                          }`}
                        >
                          <div className="min-h-0">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                              <Highlight text={it.answer} />
                            </p>

                            <div className="mt-4 flex items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyLink(i);
                                  if (typeof window !== "undefined") {
                                    history.replaceState(
                                      null,
                                      "",
                                      `#faq2-q-${i}`
                                    );
                                  }
                                }}
                                className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                                aria-label={`Copy link to "${it.question}"`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Copy link
                              </button>
                            </div>
                          </div>
                        </div>
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <a
            href="/contactSales"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:opacity-95 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Still need help? <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ArrowRight({ className }) {
  return (
    <svg
      className={`h-4 w-4 ${className || ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function escapeRegExp(str) {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
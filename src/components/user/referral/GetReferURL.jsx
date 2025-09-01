"use client";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

/* Inline icons */
const CopyIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M9 9.5A2.5 2.5 0 0 1 11.5 7h5A2.5 2.5 0 0 1 19 9.5v8A2.5 2.5 0 0 1 16.5 20h-5A2.5 2.5 0 0 1 9 17.5v-8Z" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M7 15.5H6.5A2.5 2.5 0 0 1 4 13V6.5A2.5 2.5 0 0 1 6.5 4H13a2.5 2.5 0 0 1 2.5 2.5V7" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const LinkGlyph = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M10 14a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 10a5 5 0 0 0-7.07 0l-2 2a5 5 0 0 0 7.07 7.07l1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
/* decorative sparkles */
const Sparkles = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M10 2l1.2 2.8L14 6l-2.8 1.2L10 10l-1.2-2.8L6 6l2.8-1.2L10 2z" fill="currentColor" opacity=".6"/>
    <path d="M17 11l.6 1.4L19 13l-1.4.6L17 15l-.6-1.4L15 13l1.4-.6L17 11z" fill="currentColor" opacity=".5"/>
    <path d="M4 11l.8 1.8L7 13l-1.8.8L4 16l-.8-1.8L1 13l1.8-.2L4 11z" fill="currentColor" opacity=".4"/>
  </svg>
);

const GetReferURL = ({ code }) => {
  const base = "https://storekwil.com";
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const referURL = useMemo(() => {
    if (!code) return base;
    try {
      const url = new URL(base);
      url.searchParams.set("referCode", String(code));
      return url.toString();
    } catch {
      return `${base}?referCode=${code}`;
    }
  }, [code]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referURL);
      setCopied(true);
      toast.success("Referral URL copied!");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Error copying to clipboard");
    }
  };

  return (
    <div className="w-full">
      {/* Premium header */}
      <div className="relative rounded-t-2xl border-x border-t border-amber-100 bg-gradient-to-r from-yellow-50 to-amber-50 px-5 py-4 sm:px-8 sm:py-5 overflow-hidden">
        {/* subtle decorative elements */}
        <div className="pointer-events-none absolute -top-6 -right-6 text-amber-300">
          <Sparkles className="w-16 h-16" />
        </div>
        <div className="pointer-events-none absolute -bottom-6 -left-6 text-yellow-300">
          <Sparkles className="w-14 h-14" />
        </div>

        <div className="relative flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-amber-600 shadow ring-2 ring-yellow-200">
            <LinkGlyph className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900">
              Your referral link
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Share it anywhere and earn rewards on successful signups.
            </p>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="rounded-b-2xl border border-gray-200 border-t-0 bg-white/90 backdrop-blur px-5 py-5 sm:px-8 sm:py-6 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-3">
          {/* Input with leading icon */}
          <div className="relative flex-1">
            <label
              htmlFor="referURL"
              className="absolute -top-2 left-3 inline-flex bg-white px-1 text-[11px] font-medium text-gray-500"
            >
              Referral URL
            </label>

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <LinkGlyph className="w-5 h-5" />
            </span>

            <input
              ref={inputRef}
              id="referURL"
              type="text"
              value={referURL}
              readOnly
              onClick={() => inputRef.current?.select()}
              className="w-full pl-10 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm sm:text-base font-medium text-gray-800 tracking-wide outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
            />
          </div>

          {/* Single primary button */}
          <button
            onClick={copyToClipboard}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition shadow
              ${copied ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-amber-500 text-white hover:bg-amber-600"}`}
            aria-live="polite"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>

        {/* Helper row */}
        <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span>Pro tip: add a short personal note when you share — it converts better.</span>
        </div>
      </div>
    </div>
  );
};

export default GetReferURL;

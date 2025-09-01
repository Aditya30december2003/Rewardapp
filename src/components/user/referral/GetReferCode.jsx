"use client";

import { useEffect, useMemo, useState } from "react";
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

/* SVG Pattern Badge (matches your ReferralLevelProgress style) */
const HexPatternBadge = ({ completed = true, size = 40 }) => {
  const id = `badge-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} aria-hidden>
      <defs>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={completed ? "#fbbf24" : "#e5e7eb"} />
          <stop offset="100%" stopColor={completed ? "#f59e0b" : "#d1d5db"} />
        </linearGradient>
        <pattern id={`${id}-dots`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={completed ? "rgba(255,255,255,.55)" : "rgba(107,114,128,.35)"} />
        </pattern>
        <clipPath id={`${id}-clip`}>
          <polygon points="50,2 96,25 96,75 50,98 4,75 4,25" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="100" height="100" fill={`url(#${id}-grad)`} />
        <rect width="100" height="100" fill={`url(#${id}-dots)`} />
      </g>
      <polygon
        points="50,2 96,25 96,75 50,98 4,75 4,25"
        fill="none"
        stroke={completed ? "#f59e0b" : "#e5e7eb"}
        strokeWidth="2"
      />
    </svg>
  );
};

const GetReferCode = ({ code, referCodetest }) => {
  const [referCode, setReferCode] = useState(code ?? "");
  const [copied, setCopied] = useState(false);

  // Prefer referCodetest if present (e.g., from search params)
  useEffect(() => {
    if (referCodetest && typeof referCodetest === "string") {
      setReferCode(referCodetest);
    } else if (code) {
      setReferCode(code);
    }
  }, [code, referCodetest]);

  const maskedCode = useMemo(() => {
    if (!referCode) return "";
    return referCode.length > 6
      ? `${referCode.slice(0, 4)}-${referCode.slice(4)}`
      : referCode;
  }, [referCode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Error copying to clipboard");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Card */}
      <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Banner (with HexPatternBadge instead of image) */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-50 via-amber-50 to-white" />
          <div className="relative px-5 py-4 sm:px-8 sm:py-6 flex items-center gap-4">
            <span className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl shadow ring-2 ring-yellow-200 bg-white">
              <HexPatternBadge size={40} completed />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900">
                Share your referral code
              </h2>
              <p className="text-sm text-gray-600">
                Invite friends and earn rewards instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 sm:px-8 sm:py-7">
          {/* Code field */}
          <div className="flex flex-col sm:flex-row sm:items-stretch gap-3">
            <div className="relative flex-1">
              <label
                htmlFor="referCode"
                className="absolute -top-2 left-3 inline-flex bg-white px-1 text-[11px] font-medium text-gray-500"
              >
                Your referral code
              </label>
              <input
                id="referCode"
                type="text"
                value={maskedCode}
                readOnly
                className="w-full rounded-xl border border-gray-300 bg-gray-50/70 px-4 py-3 text-center tracking-widest font-bold text-gray-900 outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
              />
            </div>

            <button
              onClick={copyToClipboard}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition
                ${copied ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-amber-500 text-white hover:bg-amber-600"} shadow`}
              aria-live="polite"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-5 h-5" /> Copied
                </>
              ) : (
                <>
                  <CopyIcon className="w-5 h-5" /> Copy code
                </>
              )}
            </button>
          </div>

          {/* Helper row */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-gray-500">
              Tip: personalize your message so friends know why they’ll love it.
            </p>
            <button
              onClick={async () => {
                const shareText = `Use my referral code: ${referCode}`;
                if (navigator.share) {
                  try {
                    await navigator.share({ title: "My referral code", text: shareText });
                  } catch { /* user cancelled */ }
                } else {
                  try {
                    await navigator.clipboard.writeText(shareText);
                    toast.info("Share text copied to clipboard!");
                  } catch {
                    toast.error("Could not prepare share text");
                  }
                }
              }}
              className="text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              Quick share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetReferCode;

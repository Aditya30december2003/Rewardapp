// src/app/contactSales/page.jsx
import React from "react";
import Link from "next/link";

// ADD: imports for the server action (no UI changes)
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/appwrite/config";

export const metadata = {
  title: "Contact Sales",
  description: "Talk to our sales team about plans, pricing, and onboarding.",
};

// ---- Server Action: create a Lead in Appwrite (crm -> leads). UI below is unchanged.
async function submit(formData) {
  "use server";

  // honeypot
  if ((formData.get("website") || "").length) return;

  // validate
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10),
    tenantId: z.string().optional(), // keep optional for future team-scoping
  });
  const data = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    redirect("/contactSales?error=invalid");
  }

  const { name, email, message, tenantId } = parsed.data;

  // request meta
  const h = headers();
  const path = h.get("x-pathname") || "/contactSales";
  const ua = h.get("user-agent") || "unknown";

  // env + client
  const DB_CRM = process.env.NEXT_CRM_PUBLIC_DATABASE_ID;
  const LEADS = process.env.NEXT_PUBLIC_COLLECTION_ID_LEADS;
  if (!DB_CRM || !LEADS) {
    throw new Error("CRM env not set (NEXT_CRM_PUBLIC_DATABASE_ID / NEXT_PUBLIC_COLLECTION_ID_LEADS)");
  }
  const { databases, teams } = createAdminClient();

  // optional: restrict to a team if tenantId provided
  let tId = tenantId || null;
  if (tId) {
    try {
      await teams.get(tId);
    } catch {
      tId = null; // ignore invalid team id
    }
  }
  const perms = tId
    ? [
        { permission: "read", role: `team:${tId}/owner` },
        { permission: "read", role: `team:${tId}/admin` },
        { permission: "update", role: `team:${tId}/owner` },
        { permission: "update", role: `team:${tId}/admin` },
        { permission: "delete", role: `team:${tId}/owner` },
      ]
    : [];

  // create lead
  await databases.createDocument(
    DB_CRM,
    LEADS,
    "unique()",
    { name, email, message, status: "new", tenantId: tId, path, ua },
    perms
  );

  // success
  redirect("/contactSales?sent=1");
}

export default function ContactSalesPage({ searchParams }) {
  return (
    <main className="relative min-h-screen">
      {/* ===== Animated SVG background (no solid page color) ===== */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C4DFF" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#5EC8FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF6BB5" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6BB5" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#8DEB9B" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7C4DFF" stopOpacity="0.6" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          id="flow1"
          d="M0,260 C220,140 420,320 640,220 860,120 1060,260 1440,220"
          fill="none"
          stroke="url(#grad1)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="12 12"
          filter="url(#softGlow)"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-800" dur="16s" repeatCount="indefinite" />
        </path>

        <path
          id="flow2"
          d="M0,560 C260,460 480,680 740,540 1000,400 1200,520 1440,540"
          fill="none"
          stroke="url(#grad2)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="10 14"
          opacity="0.9"
          filter="url(#softGlow)"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="20s" repeatCount="indefinite" />
        </path>

        <g>
          <circle r="6" fill="#7C4DFF">
            <animateMotion dur="18s" repeatCount="indefinite" rotate="auto">
              <mpath href="#flow1" />
            </animateMotion>
          </circle>
          <rect width="10" height="10" rx="2" fill="#FF6BB5">
            <animateMotion dur="22s" begin="1s" repeatCount="indefinite" rotate="auto">
              <mpath href="#flow2" />
            </animateMotion>
          </rect>
        </g>
      </svg>
      {/* ===== /Animated background ===== */}

      {/* Top action row w/ Home button */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow ring-1 ring-slate-200 backdrop-blur transition hover:text-[#7C4DFF] hover:ring-[#7C4DFF]/40 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-slate-700"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" className="transition group-hover:-translate-x-0.5">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">Home</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      {/* Card */}
      <section className="relative mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <div className="rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/5">
          <div className="grid grid-cols-1 gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-12">
            {/* Illustration (left) */}
            <div className="hidden place-content-center lg:grid">
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -left-6 -top-6 h-8 w-8 rotate-12 rounded-sm border-2 border-yellow-400/60" />
                <div className="absolute -right-3 -top-3 h-3 w-3 rounded-full bg-rose-400/80" />
                <div className="absolute -left-2 bottom-6 h-3 w-3 rounded-full bg-emerald-400/80" />
                <div className="absolute right-4 bottom-2 -rotate-12 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-yellow-400/80" />
                <svg viewBox="0 0 360 260" className="mx-auto block w-full drop-shadow-md">
                  <rect x="0" y="0" width="360" height="260" fill="transparent" />
                  <g opacity="0.16">
                    <rect x="20" y="24" rx="12" width="120" height="20" fill="#000" />
                    <rect x="20" y="60" rx="12" width="220" height="20" fill="#000" />
                    <rect x="20" y="96" rx="12" width="170" height="20" fill="#000" />
                    <rect x="20" y="210" rx="12" width="100" height="16" fill="#000" />
                  </g>
                  <rect x="90" y="70" width="180" height="120" rx="14" fill="#EFEAFE" />
                  <path d="M90 90 L180 145 L270 90 V70 H90 Z" fill="#7C4DFF" />
                  <path d="M90 90 L180 160 L270 90" stroke="#D6C8FF" strokeWidth="8" />
                </svg>
              </div>
            </div>

            {/* Form (right) */}
            <div className="mx-auto w-full max-w-md">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Get in touch</h2>

              {/* Status Messages */}
              {searchParams?.sent === "1" && (
                <div className="mt-4 flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:ring-emerald-800">
                  <svg width="20" height="20" viewBox="0 0 24 24" className="text-emerald-600 dark:text-emerald-400">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <p className="font-medium text-emerald-800 dark:text-emerald-200">Message sent successfully!</p>
                  </div>
                </div>
              )}

              {searchParams?.error === "invalid" && (
                <div className="mt-4 flex items-center gap-3 rounded-lg bg-red-50 px-4 py-3 ring-1 ring-red-200 dark:bg-red-900/20 dark:ring-red-800">
                  <svg width="20" height="20" viewBox="0 0 24 24" className="text-red-600 dark:text-red-400">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Please check your inputs</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Make sure all fields are filled correctly.</p>
                  </div>
                </div>
              )}

              <form action={submit} className="mt-6 space-y-4">
                {/* Honeypot */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                {/* Name */}
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 inline-flex items-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-400">
                      <path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="2" fill="none" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </span>
                  <input
                    name="name"
                    required
                    placeholder="Name"
                    className="h-12 w-full rounded-full border border-slate-200 bg-slate-100/70 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#7C4DFF] focus:bg-white focus:ring-2 focus:ring-[#7C4DFF]/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 inline-flex items-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-400">
                      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                    className="h-12 w-full rounded-full border border-slate-200 bg-slate-100/70 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#7C4DFF] focus:bg-white focus:ring-2 focus:ring-[#7C4DFF]/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Message"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#7C4DFF] focus:bg-white focus:ring-2 focus:ring-[#7C4DFF]/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#7C4DFF] px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#6D3BFF] active:scale-[0.99]"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Illustration above form on small screens */}
            <div className="order-first grid place-content-center lg:hidden">
              <div className="mx-auto w-full max-w-xs">
                <svg viewBox="0 0 360 260" className="mx-auto block w-full drop-shadow-md">
                  <rect x="0" y="0" width="360" height="260" fill="transparent" />
                  <g opacity="0.16">
                    <rect x="20" y="24" rx="12" width="120" height="20" fill="#000" />
                    <rect x="20" y="60" rx="12" width="220" height="20" fill="#000" />
                    <rect x="20" y="96" rx="12" width="170" height="20" fill="#000" />
                  </g>
                  <rect x="90" y="70" width="180" height="120" rx="14" fill="#EFEAFE" />
                  <path d="M90 90 L180 145 L270 90 V70 H90 Z" fill="#7C4DFF" />
                  <path d="M90 90 L180 160 L270 90" stroke="#D6C8FF" strokeWidth="8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
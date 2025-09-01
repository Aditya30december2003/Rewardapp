"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

/* Inline icons (unchanged) */
const Icon = {
  stars: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2l1.6 4.7L19 7l-3.8 3 1 4.9-4.2-2.6-4.2 2.6 1-4.9L5 7l5.4-.3L12 2z" />
      <path d="M6 16l.8 2.4L9 19l-1.9 1.5.4 2.5L6 22l-1.5 1 .4-2.5L3 19l2.2-.6L6 16z" />
      <path d="M18 16l.8 2.4 2.2.6-1.9 1.5.4 2.5-1.5-1-1.5 1 .4-2.5L15 19l2.2-.6L18 16z" />
    </svg>
  ),
  check: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 12.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  close: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  arrowRight: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function Pricing() {
  // ====== YOUR REAL DATA EXACTLY AS GIVEN ======
  const pricingPlans3 = [
    {
      // shows exactly as "Coming soon - free"
      label: "Coming soon - free",
      title: "Free",                // internal label for styling
      billing: "weekly",            // "weekly billing"
      price: 0,                     // $0
      description: "for personal",
      ctaText: "Explore the Demo",  // first CTA line you listed
      link: "#",
      // features written exactly as provided (kept spellings)
      features: ["4 webmails", "unlimted hosting"],
    },
    {
      label: "Coming soon - Basic",
      title: "Basic",
      billing: "monthly",
      price: 20,
      description: "for small business",
      ctaText: "Choose Package",
      link: "#",
      features: ["free domain", "unlimted bandwidth", "host 3 websites"],
    },
    {
      label: "Coming soon - Pro",
      title: "Pro",
      billing: "yearly",
      price: 60,
      description: "for enterprise",
      ctaText: "Choose Package",
      link: "#",
      features: [
        "free domian / sub domains",
        "get ssl certificate",
        "free vps hosting",
        "Get free marketing credit",
      ],
    },
  ];

  return (
    <section id="pricing" className="relative py-20 sm:py-24">
      {/* Decorative background */}
      <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full" viewBox="0 0 1440 900" aria-hidden="true">
        <defs>
          <radialGradient id="p-wash" cx="70%" cy="0%" r="100%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.22)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="p-brand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
       
        <path
          d="M0 700 C260 620 480 620 720 690 C980 770 1180 760 1440 660"
          fill="none"
          stroke="url(#p-brand)"
          strokeWidth="3"
          className="stroke-dash"
        />
      </svg>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading with your title */}
        <div className="relative mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-700">
            <Icon.stars className="h-4 w-4" />
            Limited-Time
          </span>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Grab Our{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-600 bg-clip-text text-transparent">
              Limited-Time Lifetime Deal
            </span>
          </h2>
        </div>

        {/* Plans */}
        <Swiper
          spaceBetween={24}
          slidesPerView={1.1}
          breakpoints={{
            0: { slidesPerView: 1.1, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="!overflow-visible"
        >
          {pricingPlans3.map((plan, idx) => {
            const accent =
              plan.title === "Pro" ? "#0ea5e9" : plan.title === "Basic" ? "#10b981" : "#6366f1";
            const uid = `pp-${idx}`;
            const period = plan.billing === "weekly" ? "week" : plan.billing === "monthly" ? "month" : "year";

            return (
              <SwiperSlide key={idx}>
                <div
                  className="group relative h-full rounded-2xl p-[1px] transition-all hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(135deg, ${accent}33, rgba(99,102,241,0.18))` }}
                >
                  <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    {/* decorative bg */}
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70"
                      viewBox="0 0 600 400"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <pattern id={`${uid}-dots`} width="18" height="18" patternUnits="userSpaceOnUse">
                          <circle cx="1" cy="1" r="1" fill="currentColor" />
                        </pattern>
                        <linearGradient id={`${uid}-grad`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0" stopColor={accent} stopOpacity="0" />
                          <stop offset="0.4" stopColor={accent} stopOpacity="0.7" />
                          <stop offset="1" stopColor={accent} stopOpacity="0" />
                        </linearGradient>
                        <radialGradient id={`${uid}-spot`} cx="50%" cy="0%" r="70%">
                          <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
                          <stop offset="60%" stopColor={accent} stopOpacity="0.06" />
                          <stop offset="100%" stopColor={accent} stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    
                      <path d="M-60 330 C 80 260, 220 380, 360 320 S 620 280, 720 340" fill="none" stroke={`url(#${uid}-grad)`} strokeWidth="3" />
                    </svg>

                    {/* pill shows EXACT text e.g. "Coming soon - free" */}
                    <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/70 px-2.5 py-1 text-xs font-bold text-slate-800 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                      {plan.label}
                    </span>

                    {/* description */}
                    <p className="text-slate-600 dark:text-slate-300">{plan.description}</p>

                    {/* price & billing period */}
                    <div className="mt-3 flex items-end gap-2">
                      <div className="text-4xl font-extrabold text-slate-900 dark:text-white">${plan.price}</div>
                      <div className="pb-1 text-sm text-slate-500 dark:text-slate-400">/ {period}</div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{plan.billing} billing</p>

                    <hr className="my-5 border-slate-200/70 dark:border-slate-700/70" />

                    {/* features (exact text) */}
                    <ul className="space-y-2">
                      <li className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">What’s included</li>
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Icon.check className="h-5 w-5" style={{ color: accent }} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA uses your exact text (Explore the Demo / Choose Package) */}
                    <div className="mt-6 grid place-items-center gap-2">
                      <Link
                        href={plan.link}
                        className={`inline-flex w-full items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                          plan.title === "Pro"
                            ? "border-transparent text-white"
                            : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/60"
                        }`}
                        style={plan.title === "Pro" ? { backgroundImage: `linear-gradient(90deg, ${accent}, #6366f1)` } : {}}
                      >
                        {plan.ctaText}
                        <Icon.arrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>

                    {/* hover glow */}
                    <span
                      className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
                      style={{ background: `radial-gradient(60% 60% at 50% 0%, ${accent}33, transparent 70%)` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <p className="mt-6 text-center text-sm text-slate-500">
          Prices shown per each plan’s billing period.
        </p>
      </div>

      {/* stroke animation */}
      <style jsx>{`
        .stroke-dash {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: dash 12s linear infinite;
        }
        @keyframes dash {
          0% { stroke-dashoffset: 260; }
          50% { stroke-dashoffset: 130; }
          100% { stroke-dashoffset: -260; }
        }
        @media (prefers-reduced-motion: reduce) {
          .stroke-dash { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

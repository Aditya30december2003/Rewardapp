"use client";

import Login from "../../components/auth/Login";
import Pricing from "@/components/user/Landing/Pricing";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import Features from "@/components/user/Landing/Features";
import CTA from "@/components/user/Landing/CTA";
import TyperComponent from "@/components/ui/Actions/TyperComponent";
import FAQ2 from "@/components/user/Landing/FAQ2";
import Contactus from "@/components/user/Landing/Contactus";
import Footer from "@/components/user/Landing/Footer";
import Section3 from "@/components/user/Landing/Section3";

const RandomSvgBackground = () => {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const W = 1440, H = 900;
    const COUNT = 70;
    const floats = ["float-a", "float-b", "float-c"];
    const spins = [null, "spin-slow", "spin-med"];
    const delays = ["delay-0", "delay-1", "delay-2", "delay-3", "delay-4", "delay-5"];
    const fills = ["url(#gBlue)", "url(#gEmerald)", "url(#gIndigo)"];
    const strokes = fills;

    const rand = (min, max) => Math.random() * (max - min) + min;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const kinds = ["circle", "triangle", "diamond", "squiggle"];

    const out = Array.from({ length: COUNT }, () => {
      const kindPick = pick(kinds);
      const x = rand(40, W - 40);
      const y = rand(60, H - 60);
      const rot = rand(0, 360);
      const float = pick(floats);
      const spin = pick(spins);
      const delay = pick(delays);
      const opacity = rand(0.25, 0.55);

      if (kindPick === "circle") {
        return { kind: "circle", x, y, r: rand(2, 4), fill: pick(fills), float, spin, delay, opacity, rot };
      }
      if (kindPick === "triangle") {
        return { kind: "triangle", x, y, s: rand(10, 18), fill: pick(fills), float, spin, delay, opacity, rot };
      }
      if (kindPick === "diamond") {
        return { kind: "diamond", x, y, s: rand(8, 14), stroke: pick(strokes), float, spin, delay, opacity, rot };
      }
      return { kind: "squiggle", x, y, s: rand(8, 14), stroke: pick(strokes), float, spin, delay, opacity, rot };
    });

    setShapes(out);
  }, []);

  const triPoints = (s) => {
    const h = (Math.sqrt(3) / 2) * s;
    return `0,${-h} ${s / 2},${h / 2} ${-s / 2},${h / 2}`;
  };

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="pageWash" cx="70%" cy="10%" r="80%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.10)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="gEmerald" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
        <linearGradient id="gIndigo" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1440" height="900" fill="url(#pageWash)" />

      {shapes.map((s, i) => {
        if (s.kind === "circle") {
          return (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              <g className={`${s.float} ${s.delay}`}>
                <g transform={`rotate(${s.rot})`} opacity={s.opacity} filter="url(#softGlow)">
                  <g className={s.spin || ""}><circle r={s.r} fill={s.fill} /></g>
                </g>
              </g>
            </g>
          );
        }
        if (s.kind === "triangle") {
          return (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              <g className={`${s.float} ${s.delay}`}>
                <g transform={`rotate(${s.rot})`} opacity={s.opacity} filter="url(#softGlow)">
                  <g className={s.spin || ""}><polygon points={triPoints(s.s)} fill={s.fill} /></g>
                </g>
              </g>
            </g>
          );
        }
        if (s.kind === "diamond") {
          return (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              <g className={`${s.float} ${s.delay}`}>
                <g transform={`rotate(${s.rot})`} opacity={s.opacity} filter="url(#softGlow)">
                  <g className={s.spin || ""}>
                    <polygon points={`0,${-s.s} ${s.s},0 0,${s.s} ${-s.s},0`} fill="none" stroke={s.stroke} strokeWidth="1" />
                  </g>
                </g>
              </g>
            </g>
          );
        }
        return (
          <g key={i} transform={`translate(${s.x} ${s.y})`}>
            <g className={`${s.float} ${s.delay}`}>
              <g transform={`rotate(${s.rot})`} opacity={s.opacity} filter="url(#softGlow)">
                <g className={s.spin || ""}>
                  <path
                    d={`M ${-s.s} 0 C ${-s.s / 2} ${-s.s}, ${s.s / 2} ${s.s}, ${s.s} 0`}
                    fill="none"
                    stroke={s.stroke}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Animated background */}
      <RandomSvgBackground />

      <header className="sticky top-0 z-50 bg-transparent backdrop-blur-sm">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/darklogo.png"
              alt="Perktify logo"
              className="h-15 w-auto transition-transform hover:scale-105 md:h-20"
            />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {/* Forgot Password as plain grey text link */}
            <Link
              href="/password/reset"
              className="text-gray-500 transition-colors hover:text-gray-700"
            >
              Forgot Password?
            </Link>

            {/* View Demo button */}
            <Link
              href="/login?demo=true"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white transition-all hover:bg-indigo-700 hover:shadow-md"
            >
              View Demo
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-20">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-10 md:grid-cols-2 md:gap-12 md:px-10 md:py-16">
          {/* Left copy */}
          <section className="relative max-w-2xl text-center md:text-left">
            {/* Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl md:leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-indigo-600 to-indigo-900 bg-clip-text text-transparent">
                Perktify Reward
              </span>
              <br />
              Dashboard
            </h1>

            {/* Animated tagline */}
            <div className="mt-5 flex items-center justify-center md:justify-start">
              <span className="rounded-full border border-gray-200 bg-white/90 px-4 py-1.5 text-sm text-gray-700 shadow-sm backdrop-blur-sm">
                <TyperComponent
                  strings={["Secure SSO & MFA", "Real-time Analytics", "Admin Controls"]}
                />
              </span>
              <span className="ml-1 animate-caret text-gray-500">|</span>
            </div>

            {/* Supporting text */}
            <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
              Manage rewards, track performance, and unlock insights.
              <br className="hidden md:block" />
              Sign in to access your account.
            </p>

            {/* Feature badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {["Secure SSO & MFA", "Real-time Analytics", "Admin Controls"].map(
                (feature, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-indigo-100 bg-indigo-50/70 px-4 py-1.5 text-xs font-medium text-indigo-700 shadow-sm hover:bg-indigo-100 transition"
                  >
                    {feature}
                  </span>
                )
              )}
            </div>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Create a new Perktify account"
              >
                🚀 Create Account
              </Link>

              <Link
                href="/contactSales"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Contact sales team"
              >
                💬 Contact Sales
              </Link>
            </div>
          </section>


          {/* Right: login card */}
          <section className="flex w-full items-center justify-center px-4 sm:px-6 animate-fade-in-up">
            <div className="w-full max-w-md">
              <div className="relative group">
                {/* === Half-hidden animated SVG chip === */}
                <div className="pointer-events-none absolute left-0 top-8 z-0">

                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>

                {/* Card shell */}
                <div className="relative z-10 rounded-2xl border border-gray-200 bg-white p-[1px] shadow-xl transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                  <span className="pointer-events-none absolute -left-1/3 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent animate-shimmer" />
                  <div className="rounded-[15px] bg-white p-8">
                    <Suspense
                      fallback={
                        <div className="space-y-6">
                          <div className="flex flex-col gap-1">
                            <div className="h-4 w-1/3 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="h-10 rounded-lg bg-gray-200 animate-pulse mt-2"></div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="h-4 w-1/3 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="h-10 rounded-lg bg-gray-200 animate-pulse mt-2"></div>
                          </div>
                          <div className="h-11 rounded-lg bg-gray-300 animate-pulse mt-4"></div>
                        </div>
                      }
                    >
                      <Login variant="bare" />
                    </Suspense>



                    {/* Mobile actions */}
                    <div className="md:hidden mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
                      <Link href="/login?demo=true" className="flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Demo
                      </Link>
                      <Link href="/contact" className="flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Sales
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footnote */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-600 leading-relaxed transition-all duration-300 hover:text-gray-800">
                  By signing in, you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-indigo-600 font-medium decoration-indigo-400/60 hover:decoration-indigo-500 transition-all">Terms</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-indigo-600 font-medium decoration-indigo-400/60 hover:decoration-indigo-500 transition-all">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <section className="relative z-20">
        <Features />
      </section>


      <section>
        <Section3 />
      </section>

      <section>
        <Pricing />
      </section>


      <section>
        <CTA />
      </section>

      <section>
        <FAQ2 />
      </section>

      <section>
        <Contactus />
      </section>

      <section>
        <Footer />
      </section>

      {/* Animations */}
      <style jsx global>{`
        svg * { transform-box: fill-box; transform-origin: center; will-change: transform; }

        /* Background shapes */
        .float-a { animation: floatA 8s ease-in-out infinite; }
        .float-b { animation: floatB 10s ease-in-out infinite; }
        .float-c { animation: floatC 12s ease-in-out infinite; }
        @keyframes floatA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,-12px)} }
        @keyframes floatB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-12px,10px)} }
        @keyframes floatC { 0%,100%{transform:translate(0,0)} 50%{transform:translate(8px,8px)} }
        .spin-slow { animation: spin 22s linear infinite; }
        .spin-med  { animation: spin 14s linear infinite; }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

        /* Half-hidden chip motion + outline draw */
        .peek-chip { animation: chipPeek 5.5s ease-in-out infinite; }
        .chip-stroke { animation: chipStroke 3s ease forwards 0.6s; }
        @keyframes chipPeek {
          0%, 20%   { transform: translateX(0) translateY(0); }
          40%, 60%  { transform: translateX(12px) translateY(-2px); }
          80%, 100% { transform: translateX(0) translateY(0); }
        }
        @keyframes chipStroke {
          from { stroke-dashoffset: 760; }
          to   { stroke-dashoffset: 0; }
        }

        /* Shimmer + caret */
        @keyframes shimmer { 0%{transform:translateX(-66%);opacity:0} 50%{opacity:.7} 100%{transform:translateX(200%);opacity:0} }
        .animate-shimmer { animation: shimmer 2.5s ease-in-out infinite; }
        @keyframes caret { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        .animate-caret { animation: caret 1s steps(2, start) infinite; }

        /* Sign-in form animation */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.5s ease-out 200ms forwards;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .float-a, .float-b, .float-c, .spin-slow, .spin-med, .peek-chip, .chip-stroke, .animate-shimmer, .animate-caret, .animate-fade-in-up {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

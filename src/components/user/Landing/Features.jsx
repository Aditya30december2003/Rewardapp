'use client';

import React, { useState } from "react";

/* = Inline SVG Icons (no external icon fonts) = */
const Icon = {
  rocket: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      {/* body */}
      <path
        d="M12 2c-2.7 2.3-4.5 6-4.5 9.8V15h9v-3.2C16.5 8 14.7 4.3 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* window */}
      <circle cx="12" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      {/* nozzle & fins */}
      <path
        d="M9 15l-1 2h8l-1-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 15c-1.8.3-3.2 1.2-4 2.8 1.8-.2 3.4-.1 4.9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 15c1.8.3 3.2 1.2 4 2.8-1.8-.2-3.4-.1-4.9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* flame */}
      <path
        d="M12 19c1.6 1.1 2 2.5 0 3.5-2-1-1.6-2.4 0-3.5Z"
        fill="currentColor"
        fillOpacity=".6"
      />
    </svg>
  ),
  shield: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 3l7 3v5c0 5.25-3.5 9.75-7 10-3.5-.25-7-4.75-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  lightning: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    </svg>
  ),
  heartPulse: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M3 9.5C3 6.5 5.5 4 8.5 4c1.7 0 3.2.8 4.2 2.1C13.7 4.8 15.2 4 16.9 4 19.9 4 22.4 6.5 22.4 9.5c0 6.5-9.9 10.5-9.9 10.5S3 16 3 9.5z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M4 10h4l2-3 3 6 2-3h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  graphUp: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 16l4-5 4 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 7h3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shieldCheck: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 3l7 3v5c0 5.25-3.5 9.75-7 10-3.5-.25-7-4.75-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8.5 12.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  speedometer: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 14a8 8 0 1116 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 14l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="14" r="1" fill="currentColor"/>
    </svg>
  ),
  headset: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 12a8 8 0 1116 0v5a2 2 0 01-2 2h-2v-7h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 12h4v7H8a2 2 0 01-2-2v-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  checkCircle: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  stars: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2l1.6 4.7L19 7l-3.8 3 1 4.9-4.2-2.6-4.2 2.6 1-4.9L5 7l5.4-.3L12 2z"/>
      <path d="M6 16l.8 2.4L9 19l-1.9 1.5L7 23l-1.5-1-1.5 1 .4-2.5L2 19l2.2-.6L6 16z"/>
      <path d="M18 16l.8 2.4 2.2 .6-1.9 1.5 .4 2.5-1.5-1-1.5 1 .4-2.5L15 19l2.2-.6L18 16z"/>
    </svg>
  ),
  arrowRight: (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 12h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

/* Helper to pick the right icon per tab */
const TabIcon = ({ id, className }) => {
  switch (id) {
    case "features-tab-1":
      return <Icon.rocket className={className} />;
    case "features-tab-2":
      return <Icon.shield className={className} />;
    case "features-tab-3":
      return <Icon.lightning className={className} />;
    case "features-tab-4":
      return <Icon.heartPulse className={className} />;
    default:
      return <Icon.rocket className={className} />;
  }
};

const FloatingIcon = ({ id, className }) => {
  switch (id) {
    case "features-tab-1":
      return <Icon.graphUp className={className} />;
    case "features-tab-2":
      return <Icon.shieldCheck className={className} />;
    case "features-tab-3":
      return <Icon.speedometer className={className} />;
    case "features-tab-4":
      return <Icon.headset className={className} />;
    default:
      return <Icon.graphUp className={className} />;
  }
};

const Features = () => {
  const [activeTab, setActiveTab] = useState("features-tab-1");
  const tabs = [
    {
      id: "features-tab-1",
      title: "Scalability",
      subtitle: "Grow Your Brand",
      mainTitle: "Built to Scale With You",
      description:
        "Our platform is engineered for growth. Whether you're just starting or managing a global brand, our scalable unified ecosystem handles the complexity so you can focus on what you do best.",
      features: [
        "Handle increasing transaction volumes",
        "Expand to new markets effortlessly",
        "Robust infrastructure for peak performance",
        "Flexible to adapt to your business needs",
      ],
      stats: [
        { value: "10x", label: "Growth Ready" },
        { value: "50K+", label: "Users" },
        { value: "99.9%", label: "Uptime" },
      ],
      image: "assets/img/features/features-4.webp",
      floatingTitle: "Business Growth",
      floatingValue: "Scale Faster",
    },
    {
      id: "features-tab-2",
      title: "Unified Ecosystem",
      subtitle: "All-in-One Platform",
      mainTitle: "A Single Source of Truth",
      description:
        "Welcome to the future of business management. Consolidate your royalty operations into one intuitive platform, eliminating data silos and streamlining your workflow.",
      features: [
        "Centralized dashboard for all data",
        "Integrated payment processing",
        "Seamless reporting and analytics",
        "Connect with existing tools via API",
      ],
      stats: [
        { value: "100%", label: "Unified Data" },
        { value: "ISO", label: "Certified" },
        { value: "Secure", label: "Infra" },
      ],
      image: "assets/img/features/features-2.webp",
      floatingTitle: "Efficiency",
      floatingValue: "Streamlined Ops",
    },
    {
      id: "features-tab-3",
      title: "Royalty Management",
      subtitle: "Automate Complexity",
      mainTitle: "Effortless Royalty Management",
      description:
        "Take the manual work out of royalty calculations and distributions. Our automated system ensures accuracy and timeliness, freeing up your resources for more strategic initiatives.",
      features: [
        "Automated royalty calculations",
        "Scheduled and on-demand payouts",
        "Transparent statements for partners",
        "Full compliance and audit trails",
      ],
      stats: [
        { value: "90%", label: "Less Admin" },
        { value: "100%", label: "Accurate" },
        { value: "Global", label: "Payouts" },
      ],
      image: "assets/img/features/features-6.webp",
      floatingTitle: "Automation",
      floatingValue: "Ultra Fast",
    },
    {
      id: "features-tab-4",
      title: "Focus on Growth",
      subtitle: "We Handle the Rest",
      mainTitle: "Focus On What You Do Best",
      description:
        "Stop getting bogged down by administrative tasks. We provide the tools and support you need to manage your brand's royalties effectively, allowing you to concentrate on innovation and growth.",
      features: [
        "Reduce administrative overhead",
        "Gain actionable insights from data",
        "Empower your partners and creators",
        "Dedicated support team at your service",
      ],
      stats: [
        { value: "24/7", label: "Support" },
        { value: "2min", label: "Response" },
        { value: "Expert", label: "Team" },
      ],
      image: "assets/img/features/features-1.webp",
      floatingTitle: "Support",
      floatingValue: "Always Here",
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  return (
    <section
      id="features"
      className="relative features-section py-20 sm:py-24"
      aria-labelledby="features-heading"
    >
      {/* Decorative SVG Background */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        viewBox="0 0 1440 900"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="wash" cx="70%" cy="0%" r="100%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f172a" opacity="0.06" />
          </pattern>
        </defs>
        <rect width="1440" height="900" fill="url(#wash)" />
        <rect width="1440" height="900" fill="url(#dots)" />
        <path
          d="M0 640 C200 560 380 560 600 630 C840 710 1040 700 1440 600"
          fill="none"
          stroke="url(#brand)"
          strokeWidth="3"
          className="svg-dash"
        />
      </svg>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="relative mx-auto mb-16 max-w-3xl text-center" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-700">
            <Icon.stars className="h-4 w-4" /> Features
          </span>
          <h2
            id="features-heading"
            className="mt-3 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl"
          >
            Powerful Features
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
            Designed to help you work smarter, not harder with our cutting-edge technology.
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
        {/* Tabs */}
        <div className="features-container" data-aos="fade-up" data-aos-delay="100">
          <div className="tabs-wrapper">
            {/* Tab Navigation */}
            <ul className="mb-12 flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id} className="w-full sm:w-auto">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={[
                        "group relative flex items-center gap-4 rounded-2xl px-6 py-4 transition-all duration-300 focus:outline-none",
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg shadow-indigo-500/25"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50",
                      ].join(" ")}
                      aria-current={isActive ? "page" : undefined}
                      aria-controls={tab.id}
                    >
                      <span
                        className={[
                          "grid h-10 w-10 place-items-center rounded-xl",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-700 group-hover:bg-white group-hover:text-indigo-600",
                        ].join(" ")}
                        aria-hidden
                      >
                        <TabIcon id={tab.id} className="h-6 w-6" />
                      </span>
                      <span className="text-left">
                        <span className="block font-semibold leading-tight">{tab.title}</span>
                        <span className="block text-xs opacity-80">{tab.subtitle}</span>
                      </span>
                      {/* shimmer highlight */}
                      <span className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
                        <span className="btn-sheen" />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {/* Tab Content */}
            <div
              className="relative overflow-hidden rounded-3xl bg-white/90"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {/* corner glow accents */}
              <span className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-indigo-200/40 blur-2xl" />
              <span className="pointer-events-none absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-emerald-200/40 blur-2xl" />
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Content */}
                <div className="p-8 md:p-12">
                  <div className="mb-6 flex items-center">
                    <div className="mr-4 rounded-lg bg-indigo-50 p-3 text-indigo-600 ring-1 ring-indigo-100">
                      <TabIcon id={activeTabData.id} className="h-7 w-7" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900">
                      {activeTabData.mainTitle}
                    </h3>
                  </div>
                  <p className="mb-8 text-lg leading-relaxed text-slate-600">
                    {activeTabData.description}
                  </p>
                  <div className="mb-8 grid gap-4">
                    {activeTabData.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <Icon.checkCircle className="mt-1 mr-3 h-5 w-5 text-indigo-600" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mb-8 flex flex-wrap gap-8">
                    {activeTabData.stats.map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-3xl font-extrabold tracking-tight text-indigo-600">
                          {stat.value}
                        </div>
                        <div className="text-[11px] uppercase tracking-widest text-slate-500">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="relative inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    type="button"
                  >
                    Learn More
                    <Icon.arrowRight className="ml-2 h-5 w-5" />
                    <span className="btn-sheen -z-10" />
                  </button>
                </div>
                {/* Right Image */}
                <div className="relative hidden min-h-[420px] lg:block">
                  <div className="absolute inset-0 z-10 w-1/4 bg-gradient-to-r from-white to-transparent" />
                  <img
                    src="/features-rewards.png"
                    alt={activeTabData.title}
                    className="h-full w-full object-cover"
                  />
                  {/* floating info card */}
                  <div className="card-float absolute bottom-8 right-8 flex max-w-xs items-center rounded-xl bg-white/95 p-4 shadow-xl ring-1 ring-slate-200">
                    <div className="mr-4 rounded-lg bg-emerald-50 p-3 text-emerald-600 ring-1 ring-emerald-100">
                      <FloatingIcon id={activeTabData.id} className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">
                        {activeTabData.floatingTitle}
                      </div>
                      <div className="font-bold text-slate-900">
                        {activeTabData.floatingValue}
                      </div>
                    </div>
                  </div>
                  {/* decorative svg lines on image */}
                  <svg
                    className="pointer-events-none absolute left-6 top-6 h-16 w-40 opacity-80"
                    viewBox="0 0 160 64"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 50 C40 20 80 20 158 50"
                      stroke="url(#brand)"
                      strokeWidth="3"
                      className="svg-dash"
                    />
                    <path
                      d="M2 60 C40 30 80 30 158 60"
                      stroke="url(#brand)"
                      strokeWidth="2"
                      opacity=".5"
                      className="svg-dash"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {/* End Tab Content */}
          </div>
        </div>
      </div>
      <style jsx>{`
        .features-section {
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        }
        .svg-dash {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: dash 14s linear infinite;
          filter: drop-shadow(0 4px 10px rgba(2, 6, 23, 0.08));
        }
        .svg-draw {
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          animation: draw 1.8s ease forwards;
        }
        @keyframes dash {
          0% { stroke-dashoffset: 260; }
          50% { stroke-dashoffset: 130; }
          100% { stroke-dashoffset: -260; }
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        .btn-sheen {
          position: absolute;
          inset: 0;
          content: "";
          display: block;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 50%, rgba(255,255,255,0) 100%);
          transform: translateX(-120%) skewX(-12deg);
          animation: none;
        }
        button:hover .btn-sheen,
        .tabs-wrapper button:hover .btn-sheen { animation: sheen 1.25s ease; }
        @keyframes sheen {
          0% { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateX(150%) skewX(-12deg); opacity: 0; }
        }
        .card-float { animation: float 6s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @media (max-width: 1024px) { .features-container { padding: 0 0.5rem; } }
        @media (max-width: 640px) { .tabs-wrapper ul { flex-direction: column; } }
        @media (prefers-reduced-motion: reduce) {
          .svg-dash, .svg-draw, .card-float, .btn-sheen { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

export default Features;

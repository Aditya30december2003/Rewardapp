"use client";

import React from "react";

// Helper component for SVG icons to make the list items more visual.
const CheckIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// The main component
const LevelMetrics = ({ tiers }) => {
  const levels = [
    {
      title: tiers[0].label,
      criteria: [
        "Referred at least 1 member",
        `Earned at least ${tiers[0].threshold} points`,
      ],
      benefits: ["Receive a 5% off coupon", "1-month free app usage"],
    },
    {
      title: tiers[1].label,
      criteria: [
        "Referred at least 5 members",
        `Earned at least ${tiers[1].threshold} points`,
      ],
      benefits: [
        "Receive a 10% off coupon",
        "2-months free app usage",
        "Priority customer support",
      ],
    },
    {
      title: tiers[2].label,
      criteria: [
        "Referred at least 20 members",
        `Earned at least ${tiers[2].threshold} points`,
      ],
      benefits: [
        "Receive a 20% off coupon",
        "3-months free app usage",
        "Exclusive access to new features",
      ],
    },
  ];

  const levelThemes = [
    { gradient: "from-amber-500 to-orange-700", shadow: "shadow-orange-900/20", textColor: "text-orange-600", iconBg: "bg-orange-100" },
    { gradient: "from-slate-400 to-gray-600", shadow: "shadow-gray-900/20", textColor: "text-gray-600", iconBg: "bg-gray-100" },
    { gradient: "from-yellow-400 to-amber-500", shadow: "shadow-amber-900/20", textColor: "text-amber-600", iconBg: "bg-amber-100" },
  ];

  const ListItem = ({ text, theme }) => (
    <div className="flex items-start space-x-3">
      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${theme.iconBg}`}>
        <CheckIcon className={`${theme.textColor} w-3.5 h-3.5`} />
      </div>
      <span className="text-gray-600">{text}</span>
    </div>
  );

  const renderLevelCard = (level, index) => {
    const theme = levelThemes[index % levelThemes.length];
    return (
      <div
   
        key={index}
        className={`bg-white rounded-2xl  overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out ${theme.shadow}`}
      >
        {/* Card Header with Gradient */}
        <div    style={{marginTop:"5%"}} className={`p-6 rounded-t-2xl bg-gradient-to-br ${theme.gradient}`}>
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 bg-white/20 backdrop-blur-sm flex items-center justify-center"
              style={{
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            >
              <span className="text-white text-2xl font-bold">{index + 1}</span>
            </div>
            <h4 className="text-3xl font-bold text-white tracking-tight">
              {level.title}
            </h4>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Requirements Section */}
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">
              Minimum Requirements
            </h5>
            <div className="space-y-2">
              {level.criteria.map((item, i) => (
                <ListItem key={i} text={item} theme={theme} />
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Benefits Section */}
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">You Will Get</h5>
            <div className="space-y-2">
              {level.benefits.map((item, i) => (
                <ListItem key={i} text={item} theme={theme} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Wrap all cards + heading band (like your example)
  return (
    <div style={{marginTop:"5%"}} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-gray-900 dark:ring-gray-800">
      <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200/80 bg-slate-50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-800/40">
        <h3 className="text-xs md:text-sm font-medium leading-5 text-slate-700 dark:text-slate-200">
          Levels, Criteria &amp; Benefits
        </h3>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {levels.map((level, index) => renderLevelCard(level, index))}
        </div>
      </div>
    </div>
  );
};

// Sample host component (optional)
export default function App() {
  const tiers = [
    { label: "Bronze", threshold: 100 },
    { label: "Silver", threshold: 500 },
    { label: "Gold", threshold: 2000 },
  ];
  return <LevelMetrics tiers={tiers} />;
}

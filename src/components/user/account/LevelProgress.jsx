"use client";

import React from "react";
import { FaCheck } from "react-icons/fa";

const HexPatternBadge = ({ completed, size = 44 }) => {
  const id = React.useId();
  return (
    <svg
      viewBox="0 0 100 100"
      className="drop-shadow"
      style={{ width: size, height: size }}
      aria-hidden
    >
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

const LevelProgress = ({
  currentLevel = 0,
  points = 0,
  labels = [],
  sideImageSrc,
}) => {
  const levels = [
    { title: "New User" },
    { title: labels[0] || "Bronze" },
    { title: labels[1] || "Silver" },
    { title: labels[2] || "Gold" },
  ];

  const isCompleted = (stepIndex) => currentLevel >= stepIndex;

  const StepIcon = ({ completed, index }) =>
    completed ? (
      <FaCheck aria-label="Completed" className="w-4 h-4 text-white" />
    ) : (
      <span aria-hidden className="text-xs sm:text-sm font-medium">
        {index + 1}
      </span>
    );

  return (
    <section
      className="
        mx-auto w-[92%] max-w-6xl
        rounded-2xl
        overflow-visible md:overflow-hidden
        shadow-xl
        border border-gray-200
        bg-white
        md:grid md:grid-cols-[0.9fr,1.6fr]
      "
      aria-label="Level progress"
    >
      {/* LEFT */}
      <div style={{padding:"50px"}}   className="p-6 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-7">
          <div
            className="
              w-14 h-14 sm:w-16 sm:h-16 rounded-xl
              bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400
              flex items-center justify-center shadow-md
            "
          >
            <img
              src="/point.webp"
              alt="Points"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Earned Points</p>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">{points}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5 sm:mb-7" />

        {/* Steps */}
        <div className="-mx-2 sm:mx-0">
          <ol
            className="
              relative flex flex-nowrap items-center
              justify-start sm:justify-between
              gap-3 sm:gap-0 md:gap-0
              overflow-x-auto sm:overflow-visible
              pb-2 sm:pb-0 px-2 sm:px-0
              snap-x snap-mandatory
            "
          >
            {levels.map((level, index) => {
              const completed = isCompleted(index);
              const nextExists = index !== levels.length - 1;

              return (
                <li
                  key={index}
                  className="
                    relative flex flex-col items-center
                    shrink-0 snap-start
                  "
                >
                  {/* Row: badge + connector (line touches both badges) */}
                  <div className="flex items-center">
                    <div className="relative">
                      <HexPatternBadge completed={completed} />
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${
                          completed ? "text-white" : "text-gray-600"
                        }`}
                      >
                        <StepIcon completed={completed} index={index} />
                      </div>
                    </div>

                    {nextExists && (
                      <span
                        className={`
                          hidden sm:inline-block
                          -ml-px  /* slight overlap to touch current badge */
                          h-0.5 rounded-full
                          sm:w-[84px] md:w-[112px] lg:w-[136px] /* extends under next badge */
                          ${completed ? "bg-yellow-400" : "bg-gray-200"}
                        `}
                        aria-hidden
                      />
                    )}
                  </div>

                  {/* Title */}
                  <p
                    className={`mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center ${
                      completed ? "text-yellow-600" : "text-gray-600"
                    }`}
                  >
                    {level.title}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Subtext */}
        <div className="mt-6 rounded-lg bg-gray-50 p-3 sm:p-4 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-600 leading-snug text-center sm:text-left">
            You’re at{" "}
            <span className="font-semibold">Level {currentLevel + 1}</span>. Keep
            earning points to unlock the next milestone!
          </p>
        </div>
      </div>

      {/* RIGHT: fixed-size image */}
      <aside className="relative hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-amber-50 to-white" aria-hidden />
        <div className="relative h-full w-full p-6 lg:p-8 flex flex-col items-center justify-center">
          <div className="flex-none w-72 h-72">
            <img
              src={
                sideImageSrc ||
                "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop"
              }
              alt="Level up illustration"
              className="w-72 h-72 object-cover rounded-2xl shadow-lg"
              loading="lazy"
            />
          </div>
          <div className="mt-5 text-center">
            <h3 className="text-lg lg:text-xl font-semibold">Level Up</h3>
            <p className="text-sm text-gray-600">
              Complete actions, collect points, and climb your ranks.
            </p>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default LevelProgress;

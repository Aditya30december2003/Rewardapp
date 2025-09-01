import React from "react";
import Coupon from "./Coupon";

/**
 * Enhanced, responsive, a11y-friendly UI:
 * - Sticky "Points" panel on desktop, stacked on mobile
 * - Decorative, subtle gradient + pattern
 * - Responsive grid for rewards (1/2/3 cols)
 * - Empty & loading states
 * - Dark mode support (if Tailwind's darkMode is configured)
 * - Keyboard/focus-visible styles
 */
const RedeemPoints = ({ points = 0, rewards = [], isLoading = false }) => {
  const formattedPoints = new Intl.NumberFormat().format(points);

  return (
    <section
      className="relative w-full"
      aria-labelledby="redeem-points-heading"
    >
      {/* Background flair */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-200/60 to-fuchsia-200/60 blur-3xl dark:from-indigo-500/10 dark:to-fuchsia-500/10" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-200/60 to-emerald-200/60 blur-3xl dark:from-cyan-500/10 dark:to-emerald-500/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        {/* Header */}
        <header className="mb-8 sm:mb-12 text-center">
          <h1
            id="redeem-points-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white"
          >
            Redeem Your <span className="text-storekwiltext">Points</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Turn your points into instant rewards and exclusive offers.
          </p>
        </header>

        {/* Content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {/* Left / Top: Points Panel (sticky on desktop) */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <div className="relative overflow-hidden rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 supports-[backdrop-filter]:dark:bg-neutral-900/50 shadow-sm">
                {/* Decorative stripe */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500"
                />
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col items-center text-center gap-4">
                    <img
                      src="/gift.webp"
                      alt=""
                      role="presentation"
                      className="h-20 w-20 sm:h-24 sm:w-24 object-contain select-none"
                      draggable="false"
                    />
                    <div>
                      <h2 className="text-base sm:text-lg font-medium text-neutral-700 dark:text-neutral-300">
                        Earned Points
                      </h2>
                      <p className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                        {formattedPoints}
                      </p>
                    </div>

                    {/* Callouts */}
                    <div className="mt-2 grid w-full grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Redeemable Today
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {formattedPoints} pts
                        </p>
                      </div>
                      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Avg. Reward
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          5–20% off
                        </p>
                      </div>
                    </div>

                    {/* Helper text */}
                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                      Copy a code below and apply it at checkout. Terms may
                      apply.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right / Bottom: Rewards Grid */}
          <main className="lg:col-span-2">
            {/* Loading state */}
            {isLoading ? (
              <div
                role="status"
                aria-live="polite"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5"
                  >
                    <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-3" />
                    <div className="h-6 w-36 bg-neutral-200 dark:bg-neutral-800 rounded mb-4" />
                    <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
                  </div>
                ))}
              </div>
            ) : rewards?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {rewards.map((coupon) => (
                  <div
                    key={coupon.$id}
                    className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:focus-within:ring-offset-neutral-900"
                  >
                    {/* Optional header area for category/points */}
                    <div className="flex items-center justify-between px-5 pt-5">
                      <span className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        {coupon.pointsRequired?.toLocaleString?.() ??
                          coupon.pointsRequired}{" "}
                        pts
                      </span>
                      {coupon?.tag ? (
                        <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                          {coupon.tag}
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">
                          Reward
                        </span>
                      )}
                    </div>

                    {/* Coupon body (your component) */}
                    <div className="p-5 pt-3">
                      <Coupon
                        points={coupon.pointsRequired}
                        discountText={coupon.name}
                        couponCode={coupon.promoCode}
                        buttonLabel="Copy Code"
                        expiryDate={coupon.expiry}
                      />
                    </div>

                    {/* Hover accent */}
                    <div
                      aria-hidden="true"
                      className="h-0.5 w-full bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Empty state
              <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 p-8 sm:p-12 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="text-neutral-500 dark:text-neutral-400"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a5 5 0 0 1 5 5v1h1a3 3 0 0 1 0 6h-1v3a5 5 0 1 1-10 0v-3H6a3 3 0 0 1 0-6h1V7a5 5 0 0 1 5-5Zm3 6V7a3 3 0 1 0-6 0v1h6Zm-8 3a1 1 0 1 0 0 2h1v-2H7Zm10 0h-1v2h1a1 1 0 0 0 0-2ZM9 13v3a3 3 0 1 0 6 0v-3H9Z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  No rewards available
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Earn more points through purchases or check back later for new
                  offers.
                </p>
                <div className="mt-6">
                  <a
                    href="/rewards/how-it-works"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    Learn how to earn points
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default RedeemPoints;

// src/app/(protected)/admin/customization/page.jsx
import React, { Suspense } from "react";
import { Button } from "@heroui/react";
import { createAdminClient } from "@/appwrite/config";
import ContentUpdate from "@/components/admin/ContentUpdate";
import DashboardColorPicker from "@/components/admin/DashboardColorPicker";
import UploadImage from "@/components/admin/UploadImage";
import auth from "@/lib/auth";

// Lightweight server helper to load everything in parallel
async function loadData() {
  const { users, databases } = await createAdminClient();
  const user = await auth.getUser();
  const prefs = await users.getPrefs(user.$id);

  // If prefs don't have dbId yet, avoid throwing
  const dbId = process.env.SUBSCRIPTION_DATABASE_ID

;
  const collectionId = process.env.SUBSCRIBERS_COLLECTION_ID

;

  const dataPromise =
    prefs?.dbId && dbId && collectionId
      ? databases
          .getDocument(dbId, collectionId, prefs.dbId)
          .catch(() => ({})) // don't crash the page if the doc is missing
      : Promise.resolve({});

  const data = await dataPromise;

  return { prefs, data };
}

export default async function CustomizationPage() {
  const { prefs, data } = await loadData();

  // Defaults / fallbacks
  const heading = data?.heading || "Exclusive Rewards & Savings";
  const title =
    data?.title || "Collect points, unlock coupons, and redeem exciting offers.";
  const bodyColor = data?.bodyColor || "#ae6af5";
  const accentColor = data?.accentColor || "#ec89a7";

  // 🎯 Reward / Coupon themed placeholders
  const logoImg =
    "https://placehold.co/96x96/111827/ffffff/png?text=%F0%9F%8E%81";
  const backgroundImage =
    "https://source.unsplash.com/1600x1000/?loyalty,reward,shopping,coupon,discount";
  const heroImage = "/bg.jpg";

  return (
    <main className="relative">
      {/* Page container */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Form Customization
          </h1>
          <p className="text-sm md:text-base text-default-600">
            Update public form content, theme colors, and branding assets. The preview updates as you save.
          </p>
        </header>

        {/* Top row: editor + hero preview */}
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {/* Left editor */}
          <div className="min-w-0">
            <Suspense
              fallback={
                <div className="h-60 rounded-xl animate-pulse bg-default-100" />
              }
            >
              <ContentUpdate
                bodyColor={bodyColor}
                Heading={data?.heading || "Join the Waitlist"}
                Title={
                  data?.title ||
                  "Sign up now and be the first to know about our launch."
                }
                prefs={prefs}
              />
            </Suspense>
          </div>

          {/* Right preview: Reward/Coupon Hero */}
          <section
            aria-label="Live preview"
            className="relative overflow-hidden rounded-2xl ring-1 ring-default-200/70 aspect-[16/9]"
          >
            {/* Background image */}
            <img
              src={heroImage}
              alt="Promotional background for rewards and coupons"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />

            {/* Pattern + shade overlay for legibility */}
            <svg
              className="absolute inset-0 h-full w-full text-white/60 dark:text-black/50"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="heroDots2"
                  width="28"
                  height="28"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="2" fill="currentColor" />
                </pattern>
                <linearGradient id="heroShade" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
                  <stop offset="65%" stopColor="rgba(0,0,0,0.25)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.0)" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#heroDots2)" opacity="0.3" />
              <rect width="100%" height="100%" fill="url(#heroShade)" />
            </svg>

            {/* Content overlay */}
            <div className="relative z-10 flex h-full w-full items-end p-5 sm:p-8">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
                  {data?.heading || heading}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/85">
                  {data?.title || title}
                </p>
                <div className="mt-4">
                  <Button
                    radius="md"
                    className="font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ backgroundColor: bodyColor }}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom row: Colors + Uploaders */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-1 min-w-0">
            <Suspense
              fallback={
                <div className="h-56 rounded-xl animate-pulse bg-default-100" />
              }
            >
              <DashboardColorPicker
                getBodyColor={bodyColor}
                getAccentColor={accentColor}
                prefs={prefs}
              />
            </Suspense>
          </div>

          <div className="min-w-0">
            <Suspense
              fallback={
                <div className="h-56 rounded-xl animate-pulse bg-default-100" />
              }
            >
              <UploadImage
                getImage={backgroundImage}
                prefs={prefs}
                bodyColor={bodyColor}
                image="backgroundImageId"
                Title="Background Image"
              />
            </Suspense>
          </div>

          <div className="min-w-0">
            <Suspense
              fallback={
                <div className="h-56 rounded-xl animate-pulse bg-default-100" />
              }
            >
              <UploadImage
                getImage={logoImg}
                prefs={prefs}
                bodyColor={bodyColor}
                image="logoId"
                Title="Logo"
              />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}

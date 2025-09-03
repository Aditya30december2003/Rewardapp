// src/app/(protected)/(main)/layout.jsx
// This is your existing layout for non-tenant routes

import React from "react";
import auth from "@/lib/auth";
import SideNav from "@/components/ui/sidebar/SideNav";
import MobileTopMenu from "@/components/ui/sidebar/MobileTopMenu";
import Footer from "@/components/Footer";
import { createAdminClient } from "@/appwrite/config";
import UserMenu from "@/components/ui/UserMenu";

/* ---------- Helper Components ---------- */

function Icon({ name, className = "h-5 w-5" }) {
  if (name !== "bell") return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 17H9a4 4 0 0 1-4-4v-2a7 7 0 1 1 14 0v2a4 4 0 0 1-4 4Z" />
      <path d="M9 17a3 3 0 0 0 6 0" strokeLinecap="round" />
    </svg>
  );
}

function CircleIcon({ label, active = true }) {
  return (
    <button
      type="button"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/60 text-slate-600 transition-all duration-200 hover:bg-slate-300/80 hover:text-slate-800 hover:ring-2 hover:ring-slate-300 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:ring-slate-600"
      aria-label={label}
      title={label}
    >
      <Icon name="bell" className="h-5 w-5" />
      {active && (
        <>
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
          <span
            className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-red-500/60"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}

function HeaderBar({ user }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-gray-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-7 text-slate-900 sm:truncate sm:tracking-tight dark:text-white">
              Welcome back, {user?.name || "Guest"}!
            </h1>
            <p className="hidden md:block mt-1 text-sm text-slate-500 dark:text-slate-400">
              Let&apos;s make today productive.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <CircleIcon label="Notifications" />
            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------- */

export default async function MainLayout({ children }) {
  const { databases, users } = await createAdminClient();
  const user = await auth.getUser();

  // Original logic for main routes (using user.labels)
  const isAdmin = user?.labels?.[0] === "admin";
  const isUser = user?.labels?.[0] === "user" && user?.name !== "Demo";
  const gatedArea = isAdmin || isUser;

  let PremiumAccess = false;
  if (gatedArea) {
    try {
      const prefs = await users.getPrefs(user.$id);
      if (prefs.dbId) {
        const currentUser = await databases.getDocument(
          process.env.TENANTS_DATABASE_ID,
          process.env.TENANTS_COLLECTION_ID
,
          prefs.dbId
        );
        PremiumAccess = !!currentUser?.PremiumPlan;
      }
    } catch (error) {
      console.error("Error fetching premium status:", error);
      PremiumAccess = false;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-gray-950 md:flex-row dark:bg-gradient-to-br dark:from-gray-950 dark:via-neutral-950 dark:to-gray-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 z-50 hidden w-64 flex-col border-r border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-sm dark:border-gray-800/80 dark:bg-gray-900/60 md:flex">
        <div className="flex h-full flex-col">
          <div
            style={{ backgroundColor: "black" }}
            className="flex h-20 items-center border-b border-slate-200/60 px-6 dark:border-gray-800/80"
          >
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Main Dashboard
            </h2>
          </div>
          <SideNav />
        </div>
      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <HeaderBar user={user} />
        <MobileTopMenu user={user} PremiumPlan={PremiumAccess} />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-xl bg-white/70 p-4 shadow-subtle ring-1 ring-slate-200/70 sm:p-6 dark:bg-gray-900/50 dark:shadow-none dark:ring-white/10">
              {children}
            </div>
          </div>
        </main>

        {gatedArea ? !PremiumAccess && <Footer /> : <Footer />}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import SideNav from "@/components/ui/sidebar/SideNav";

// ---------------- Icons (you already have bell). Add a logout icon:
function LogoutIcon({ className = "h-5 w-5" }) {
  // outline "arrow-right-from-rectangle" style
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12H9" strokeLinecap="round" />
      <path d="M12 19a7 7 0 1 1 0-14" />
    </svg>
  );
}

function Icon({ name, className = "h-5 w-5" }) {
  if (name !== "bell") return null;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 17H9a4 4 0 0 1-4-4v-2a7 7 0 1 1 14 0v2a4 4 0 0 1-4 4Z" />
      <path d="M9 17a3 3 0 0 0 6 0" strokeLinecap="round" />
    </svg>
  );
}

function CircleIcon({ label, active = true }) {
  return (
    <button
      type="button"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-300/40 text-slate-600 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-300/70 hover:text-slate-800 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
      aria-label={label}
      title={label}
    >
      <Icon name="bell" />
      {active && (
        <>
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500/40 blur-[1.5px]" aria-hidden="true" />
        </>
      )}
    </button>
  );
}

function UserAvatar({ user }) {
  const initial = (user?.name || "?").charAt(0).toUpperCase();
  return (
    <div
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-400/60 text-slate-900 dark:bg-slate-600 dark:text-white text-sm font-semibold"
      aria-label={`User: ${user?.name || "User"}`}
    >
      {initial}
    </div>
  );
}

function EmailChip({ email, role = "user" }) {
  if (!email) return null;
  return (
    <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-300/40 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/60 shadow-inner dark:bg-slate-700/50 dark:text-slate-100 dark:ring-slate-600/60">
      <span className="truncate max-w-[240px] lowercase">{email}</span>
      <span className="ml-1 inline-flex items-center rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:ring-slate-600 capitalize">
        {role}
      </span>
    </div>
  );
}

// --- shared Logout button (text or icon) ---
function LogoutButton({ onLogout, variant = "text" }) {
  const handleClick = () => {
    if (typeof onLogout === "function") return onLogout();
    // fallback: change to your route if different
    if (typeof window !== "undefined") window.location.href = "/api/auth/signout";
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Logout"
        title="Logout"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-300/40 text-slate-600 ring-1 ring-slate-200/60 shadow-sm transition hover:bg-slate-300/70 hover:text-slate-800 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
      >
        <LogoutIcon />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-slate-900/10 hover:bg-slate-800 dark:bg-slate-700 dark:ring-slate-600"
    >
      <LogoutIcon className="h-4 w-4" />
      <span>Logout</span>
    </button>
  );
}

// --- MODIFIED HeaderBar ---
function HeaderBar({ user, onMenuClick, onLogout }) {
  return (
    <header className="sticky top-0 z-30 h-20 border-b border-slate-200/70 bg-[#faf8f7]/95 backdrop-blur-md shadow-sm dark:border-slate-800/70 dark:bg-neutral-900/90">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Left: Mobile hamburger */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="p-2 text-slate-600 dark:text-slate-300"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Center (desktop): tagline */}
        <div className="hidden min-w-0 md:block">
          <p className="text-sm text-slate-500 md:text-base dark:text-slate-400">
            Manage &amp; Track your activites with pleasure 
          </p>
        </div>

        {/* Right controls */}
        {/* Desktop: notifications, avatar, email, Logout (text) */}
        <div className="hidden items-center gap-3 sm:gap-4 md:flex">
          <CircleIcon label="Notifications" />
          <UserAvatar user={user} />
          <EmailChip email={user?.email} role={user?.labels?.[0]} />
          <LogoutButton onLogout={onLogout} variant="text" />
        </div>

        {/* Mobile: notifications + Logout (icon) */}
        <div className="flex items-center gap-2 md:hidden">
          <CircleIcon label="Notifications" />
          <LogoutButton onLogout={onLogout} variant="icon" />
        </div>
      </div>
    </header>
  );
}

// --- The Main UI Shell Component ---
export default function DashboardUI({ user, PremiumPlan, gatedArea, children, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <SideNav
        user={user}
        PremiumPlan={PremiumPlan}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex flex-1 flex-col md:pl-64">
        {/* pass onLogout down */}
        <HeaderBar user={user} onMenuClick={() => setIsMobileMenuOpen(true)} onLogout={onLogout} />

        <main className="flex-1">
          <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6 md:px-6">
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6 dark:bg-gray-900/80 dark:shadow-none dark:ring-white/10">
              {children}
            </div>
          </div>
        </main>

        {gatedArea ? (!PremiumPlan && <Footer />) : <Footer />}
      </div>
    </div>
  );
}

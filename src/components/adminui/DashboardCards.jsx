import {
  fetchCardDataCases,
  fetchAdminCardData,
  fetchUserCardData,
  fetchUserInsights,
  fetchUserDetails,
  fetchSuperAdminCardData,
} from "@/lib/data";

import Link from "next/link";
import { SiGraphql } from "react-icons/si";
import { TbChartInfographic } from "react-icons/tb";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaCoins } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { IoCashOutline } from "react-icons/io5";
import { MdLeaderboard } from "react-icons/md";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import { cookies } from "next/headers";

/* ----------------------------- ICON + THEME ----------------------------- */

const iconMap = {
  // Admin / Superadmin
  users: UserGroupIcon,
  direct: TbChartInfographic,
  reffered: SiGraphql, // (key spelled "reffered" in your data)
  monthly: MdOutlineCalendarMonth,
  // User
  points: FaCoins,
  available: FaHandHoldingDollar,
  used: IoCashOutline,
  leads: MdLeaderboard,
};

const themeByType = {
  users:    { tileBg: "bg-orange-100", tileText: "text-orange-500" },
  direct:   { tileBg: "bg-emerald-100", tileText: "text-emerald-600" },
  reffered: { tileBg: "bg-violet-100",  tileText: "text-violet-600" },
  monthly:  { tileBg: "bg-amber-100",   tileText: "text-amber-600" },
  points:   { tileBg: "bg-orange-100",  tileText: "text-orange-500" },
  available:{ tileBg: "bg-emerald-100", tileText: "text-emerald-600" },
  used:     { tileBg: "bg-rose-100",    tileText: "text-rose-600" },
  leads:    { tileBg: "bg-sky-100",     tileText: "text-sky-600" },
  default:  { tileBg: "bg-slate-100",   tileText: "text-slate-600" },
};

/* ----------------------------- TREND PRESETS ---------------------------- */

const defaultTrend = {
  up:   { dir: "up",   percent: "2.3%",  label: "Last Week" },
  up2:  { dir: "up",   percent: "8.1%",  label: "Last Month" },
  down: { dir: "down", percent: "0.3%",  label: "Last Month" },
  down2:{ dir: "down", percent: "10.6%", label: "Last Month" },
};

function trendForType(type) {
  switch (type) {
    case "users":
    case "points":
      return defaultTrend.up;
    case "direct":
    case "leads":
      return defaultTrend.up2;
    case "available":
      return defaultTrend.down;
    case "used":
    case "monthly":
      return defaultTrend.down2;
    case "reffered":
      return defaultTrend.up2;
    default:
      return defaultTrend.up;
  }
}

/* --------------------------------- CARD UI ------------------------------- */

function UpIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor" aria-hidden="true">
      <path d="M10 3l6 6h-4v8H8V9H4l6-6z" />
    </svg>
  );
}
function DownIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor" aria-hidden="true">
      <path d="M10 17l-6-6h4V3h4v8h4l-6 6z" />
    </svg>
  );
}

export function Card({ title, value, type, trend }) {
  const IconComp = iconMap[type] || UserIcon;
  const theme = themeByType[type] || themeByType.default;
  const t = trend || trendForType(type);
  const isUp = t.dir === "up";
  const trendColor = isUp ? "text-emerald-600" : "text-rose-600";
  const bandBorder = isUp ? "border-emerald-50" : "border-rose-50";

  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value ?? "—";

  return (
    <div
      className="
        rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200
        transition-all duration-200 hover:shadow-md hover:ring-slate-300
        dark:bg-gray-900 dark:ring-gray-800 dark:hover:ring-gray-700
      "
      aria-label={`${title}: ${displayValue}`}
    >
      {/* Header row: icon tile + title */}
      <div className="flex items-start justify-between">
        <div
          className={`grid h-12 w-12 place-items-center rounded-xl ${theme.tileBg} ${theme.tileText} shadow-inner`}
        >
          <IconComp className="h-6 w-6" />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
        </div>
      </div>

      {/* Big value */}
      <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl dark:text-slate-100">
        {displayValue}
      </div>

      {/* Soft footer band (trend + link) */}
      <div
        className={`mt-5 flex items-center justify-between rounded-xl border ${bandBorder} bg-slate-50 px-3 py-2 text-slate-600 dark:border-slate-800 dark:bg-gray-800/60 dark:text-slate-300`}
      >
        <div className="flex items-center gap-2">
          <span className={`${trendColor}`}>
            {isUp ? <UpIcon /> : <DownIcon />}
          </span>
          <span className={`text-sm font-semibold ${trendColor}`}>{t.percent}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{t.label}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- CARDS DATA ------------------------------ */

const HRCardData = async () => {
  cookies();
  const { users, direct, referred, monthly } = await safeFetch(fetchAdminCardData, {
    users: 0,
    direct: 0,
    referred: 0,
    monthly: 0,
  });

  return (
    <>
      <Card title="Earned Points" value={users} type="points" />
      <Card title="Members Enrolled" value={direct} type="leads" />
      <Card title="Available Balance" value={referred} type="available" />
      <Card title="Used Balance" value={monthly} type="used" />
    </>
  );
};

const SuperAdminCardData = async () => {
  cookies();
  const { users, direct, referred, monthly } = await safeFetch(fetchSuperAdminCardData, {
    users: 0,
    direct: 0,
    referred: 0,
    monthly: 0,
  });

  return (
    <>
      <Card title="Total Registrations" value={users} type="users" />
      <Card title="This Month Leads" value={monthly} type="monthly" />
    </>
  );
};

const AdminCardData = async () => {
  cookies();
  const { users, direct, referred, monthly } = await safeFetch(fetchAdminCardData, {
    users: 0,
    direct: 0,
    referred: 0,
    monthly: 0,
  });

  return (
    <>
      <Card title="Total Registrations" value={users} type="users" />
      <Card title="Direct Leads" value={direct} type="direct" />
      {/* NOTE: type name kept as "reffered" to match iconMap/theme keys */}
      <Card title="Referral Leads" value={referred} type="reffered" />
      <Card title="This Month Leads" value={monthly} type="monthly" />
    </>
  );
};

const UserCardData = async () => {
  cookies(); // mark as dynamic in Next.js

  const user = await safeFetch(fetchUserDetails, null);

  // Not logged in or user object missing email — choose your UX here:
  if (!user || !user.email) {
    const points = 0, leads = 0, available = 0, used = 0;
    return (
      <>
        <Card title="Earned Points" value={points} type="points" />
        <Card title="Members Enrolled" value={leads} type="leads" />
        <Card title="Available Balance" value={available} type="available" />
        <Card title="Used Balance" value={used} type="used" />
        {/* Or swap above with: <Link className="text-sm underline" href="/login">Sign in to view your cards</Link> */}
      </>
    );
  }

  const isDemo = String(user.email).toLowerCase() === "demo@storekwil.com";

  let points, leads, available, used;

  if (isDemo) {
    points = 1002;
    leads = 5;
    available = 500;
    used = 500;
  } else {
    const data = await safeFetch(fetchUserCardData, {
      points: 0,
      leads: 0,
      available: 0,
      used: 0,
    });
    ({ points, leads, available, used } = data);
  }

  return (
    <>
      <Card title="Earned Points" value={points} type="points" />
      <Card title="Members Enrolled" value={leads} type="leads" />
      <Card title="Available Balance" value={available} type="available" />
      <Card title="Used Balance" value={used} type="used" />
    </>
  );
};

const UserInsights = async ({ userId }) => {
  cookies();
  const { points, leads, available, used } = await safeFetch(
    () => fetchUserInsights(userId),
    { points: 0, leads: 0, available: 0, used: 0 }
  );

  return (
    <>
      <Card title="Earned Points" value={points} type="points" />
      <Card title="Members Enrolled" value={leads} type="leads" />
      <Card title="Available Balance" value={available} type="available" />
      <Card title="Used Balance" value={used} type="used" />
    </>
  );
};

/* ------------------------------ UTIL: SAFE FETCH ------------------------- */
/** Wrap any async fetcher and fall back to a default value on error/null. */
async function safeFetch(fn, fallback) {
  try {
    const res = await fn();
    // handle null/undefined/non-object cases gracefully
    if (res === undefined || res === null) return fallback;
    return res;
  } catch (e) {
    // console.error('[DashboardCards] fetch error:', e);
    return fallback;
  }
}

export {
  HRCardData,
  AdminCardData,
  SuperAdminCardData,
  UserCardData,
  UserInsights,
};

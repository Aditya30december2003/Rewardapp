// src/components/ui/sidebar/MobileTopMenu.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Keep this in sync with your sidebar links
const links = [
  // --- Main Admin Links ---
  { name: "Overview", href: "overview", allow: ["admin", "user", "superadmin"], group: "main" },
  { name: "User Management", href: "users-management", allow: ["admin", "superadmin"], group: "main" },
  { name: "Tier Management", href: "tiers-management", allow: ["admin"], group: "main" },
  { name: "Campaigns Management", href: "campaigns-management", allow: ["admin"], group: "main" },
  { name: "Rewards Management", href: "rewards-management", allow: ["admin"], group: "main" },
  { name: "Transaction History", href: "transaction-history", allow: ["admin"], group: "main" },
  { name: "Support Management", href: "support-management", allow: ["admin"], group: "main" },

  // --- Main User Links ---
  { name: "My Account", href: "account", allow: ["user"], group: "main" },
  { name: "Refer A Friend", href: "referral", allow: ["user"], group: "main" },
  { name: "Rewards", href: "rewards", allow: ["user"], group: "main" },
  { name: "Customer Support", href: "support", allow: ["user"], group: "main" },

  // --- Settings Links ---
  { name: "Update Password", href: "password/update", allow: ["user", "admin"], group: "settings" },
  { name: "Integration", href: "api-keys", allow: ["admin"], group: "settings" },
  { name: "Customization", href: "customization", allow: ["admin"], group: "settings" },
  { name: "Upgrade Plan", href: "upgrade-plan", allow: ["admin"], group: "settings" },
];

export default function MobileTopMenu({ user, PremiumPlan }) {
  const pathname = usePathname();
  const role = user?.labels?.[0] || "user";

  const allowed = links.filter((l) => l.allow.includes(role));

  return (
    <div className="md:hidden sticky top-20 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800/70 dark:bg-gray-900/80">
      <div className="max-w-[1600px] mx-auto px-3 py-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {allowed.map((l) => {
            const href = `/${role}/${l.href}`;
            const active = pathname === href;
            const isDisabled = PremiumPlan && l.href === "upgrade-plan";
            return (
              <Link
                key={l.name}
                href={href}
                className={clsx(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-sm ring-1 transition",
                  active
                    ? "bg-sky-600 text-white ring-sky-600 shadow-sm"
                    : "bg-white/60 text-slate-700 ring-slate-200 hover:bg-white hover:text-slate-900 dark:bg-gray-800/70 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-gray-800",
                  isDisabled && "pointer-events-none opacity-50"
                )}
              >
                {l.name}
              </Link>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

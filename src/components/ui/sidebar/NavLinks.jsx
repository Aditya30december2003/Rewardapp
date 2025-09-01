"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

// Icons
import { RxDashboard } from "react-icons/rx";
import { FaUsersCog } from "react-icons/fa";
import { TbUserPentagon, TbPentagonNumber0 } from "react-icons/tb";
import { BsGift } from "react-icons/bs";
import {
  MdSupportAgent,
  MdContactSupport,
  MdOutlinePostAdd,
  MdOutlineAutoGraph,
} from "react-icons/md";
import { GrAchievement, GrTransaction, GrUpgrade } from "react-icons/gr";
import { RiLockPasswordLine, RiKey2Fill } from "react-icons/ri";
import { BiSolidCustomize } from "react-icons/bi";
import { HiMenuAlt3, HiX } from "react-icons/hi";

// Link configuration
const links = [
  // --- Main Admin Links ---
  { name: "Overview", href: "overview", icon: RxDashboard, allow: ["admin", "user", "superadmin"], group: "main" },
  { name: "User Management", href: "users-management", icon: FaUsersCog, allow: ["admin", "superadmin"], group: "main" },
  { name: "Tier Management", href: "tiers-management", icon: TbPentagonNumber0, allow: ["admin"], group: "main" },
  { name: "Campaigns Management", href: "campaigns-management", icon: MdOutlinePostAdd, allow: ["admin"], group: "main" },
  { name: "Rewards Management", href: "rewards-management", icon: GrAchievement, allow: ["admin"], group: "main" },
  { name: "Transaction History", href: "transaction-history", icon: GrTransaction, allow: ["admin"], group: "main" },
  { name: "Support Management", href: "support-management", icon: MdContactSupport, allow: ["admin"], group: "main" },

  // --- Main User Links ---
  { name: "My Account", href: "account", icon: TbUserPentagon, allow: ["user"], group: "main" },
  { name: "Refer A Friend", href: "referral", icon: MdOutlineAutoGraph, allow: ["user"], group: "main" },
  { name: "Rewards", href: "rewards", icon: BsGift, allow: ["user"], group: "main" },
  { name: "Customer Support", href: "support", icon: MdSupportAgent, allow: ["user"], group: "main" },

  // --- Settings Links ---
  { name: "Update Password", href: "password/update", icon: RiLockPasswordLine, allow: ["user", "admin"], group: "settings" },
  { name: "Integration", href: "api-keys", icon: RiKey2Fill, allow: ["admin"], group: "settings" },
  { name: "Customization", href: "customization", icon: BiSolidCustomize, allow: ["admin"], group: "settings" },
  { name: "Upgrade Plan", href: "upgrade-plan", icon: GrUpgrade, allow: ["admin"], group: "settings" },
];

export default function Sidebar({ user, PremiumPlan }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRole = user?.labels?.[0] || "user";

  const allowedLinks = links.filter((link) => link.allow.includes(userRole));
  const mainLinks = allowedLinks.filter((l) => l.group === "main");
  const settingsLinks = allowedLinks.filter((l) => l.group === "settings");

  const NavLink = ({ link }) => {
    const LinkIcon = link.icon;
    const isLinkDisabled = PremiumPlan && link.href === "upgrade-plan";
    const linkPath = `/${userRole}/${link.href}`;
    const isActive = pathname === linkPath;

    return (
      <Link
        href={linkPath}
        className={clsx(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white",
          {
            "bg-sky-600 text-white shadow-lg": isActive,
            "pointer-events-none opacity-50": isLinkDisabled,
          }
        )}
        onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
      >
        <LinkIcon className="h-5 w-5" />
        <span className="text-sm font-medium">{link.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button (flush to top) */}
      <button
        className="fixed top-0 right-0 z-50 m-3 rounded-full bg-gray-800 p-2 text-white shadow-lg md:hidden"
        onClick={() => setIsMobileMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 flex h-screen w-64 flex-col bg-gray-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0",
          {
            "translate-x-0": isMobileMenuOpen,
            "-translate-x-full": !isMobileMenuOpen,
          }
        )}
      >
        {/* Header/Logo (reduced height to remove extra space) */}
        <div style={{marginTop:"8%"}} className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
          <Link href={`/${userRole}/overview`}>
            <Image src="/logo.png" alt="YourApp Logo" width={100} height={100} priority />
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-4 overflow-y-auto p-4 sidebar-scroll">
          {mainLinks.length > 0 && (
            <div>
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Main
              </p>
              <div className="space-y-1">
                {mainLinks.map((link) => (
                  <NavLink key={link.name} link={link} />
                ))}
              </div>
            </div>
          )}

          {settingsLinks.length > 0 && (
            <div>
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Settings
              </p>
              <div className="space-y-1">
                {settingsLinks.map((link) => (
                  <NavLink key={link.name} link={link} />
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Footer/User profile */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.name || "User Name"}</p>
              <p className="text-xs text-gray-400">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

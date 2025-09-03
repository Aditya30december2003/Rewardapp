"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Icons
import { RxDashboard } from "react-icons/rx";
import { FaUsersCog, FaKey } from "react-icons/fa";
import { TbUserPentagon } from "react-icons/tb";
import { BsGift, BsCreditCard } from "react-icons/bs";
import { 
  MdSupportAgent, 
  MdOutlineCampaign, 
  MdOutlineUpgrade
} from "react-icons/md";
import { 
  RiLockPasswordLine, 
  RiCoinsLine, 
  RiHistoryLine,
  RiUserSettingsLine
} from "react-icons/ri";
import { 
  HiMenuAlt3, 
  HiX, 
  HiOutlineUserGroup,
  HiOutlineGift,
  HiOutlineCollection
} from "react-icons/hi";
import { 
  AiOutlineApi, 
  AiOutlineLayout, 
  AiOutlineFileText 
} from "react-icons/ai";

// Same link configuration as TenantSideNav
const tenantLinks = [
  // Admin links
  { name: "Overview", href: "overview", icon: RxDashboard, allow: ["admin", "user", "superadmin"], group: "main" },
  { name: "API Keys", href: "api-keys", icon: AiOutlineApi, allow: ["admin"], group: "main" },
  { name: "Campaigns Management", href: "campaigns-management", icon: MdOutlineCampaign, allow: ["admin"], group: "main" },
  { name: "Customization", href: "customization", icon: AiOutlineLayout, allow: ["admin"], group: "main" },
  { name: "Marketing Material", href: "marketing-material", icon: AiOutlineFileText, allow: ["admin"], group: "main" },
  { name: "Rewards Management", href: "rewards-management", icon: HiOutlineGift, allow: ["admin"], group: "main" },
  { name: "Stripe", href: "stripe", icon: BsCreditCard, allow: ["admin"], group: "main" },
  { name: "Support Management", href: "support-management", icon: RiUserSettingsLine, allow: ["admin"], group: "main" },
  { name: "Tiers Management", href: "tiers-management", icon: HiOutlineCollection, allow: ["admin"], group: "main" },
  { name: "Transaction History", href: "transaction-history", icon: RiHistoryLine, allow: ["admin"], group: "main" },
  { name: "Upgrade Plan", href: "upgrade-plan", icon: MdOutlineUpgrade, allow: ["admin"], group: "main" },
  { name: "User Management", href: "users-management", icon: FaUsersCog, allow: ["admin", "superadmin"], group: "main" },
  { name: "Waitlist", href: "waitlist", icon: HiOutlineUserGroup, allow: ["admin"], group: "main" },
  
  // User links
  { name: "My Account", href: "account", icon: TbUserPentagon, allow: ["user"], group: "main" },
  { name: "Rewards", href: "rewards", icon: BsGift, allow: ["user"], group: "main" },
  { name: "Customer Support", href: "support", icon: MdSupportAgent, allow: ["user"], group: "main" },
  { name: "Referral", href: "referral", icon: RiCoinsLine, allow: ["user"], group: "main" },
  
  // Settings links
  { name: "Update Password", href: "password/update", icon: RiLockPasswordLine, allow: ["user", "admin"], group: "settings" },
  { name: "API Keys", href: "api-keys", icon: FaKey, allow: ["admin"], group: "settings" },
];

export default function TenantMobileTopMenu({ user, uiRole, basePrefix, PremiumPlan = false }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter links based on the user's role
  const allowedLinks = tenantLinks.filter((link) => link.allow.includes(uiRole));

  const NavLink = ({ link }) => {
    const LinkIcon = link.icon;
    const isLinkDisabled = PremiumPlan && link.href === "upgrade-plan";

    // Build the full path: /t/[tenant]/[role]/[href]
    const linkPath = `${basePrefix}/${uiRole}/${link.href}`;

    // Check if current path matches this link
    const isActive = pathname === linkPath || pathname.startsWith(linkPath + "/");

    return (
      <Link
        href={linkPath}
        className={clsx(
          "flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
          {
            "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200": isActive,
            "pointer-events-none opacity-50": isLinkDisabled,
          }
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <LinkIcon className="h-5 w-5" />
        <span className="text-sm font-medium">{link.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Trigger - only visible on small screens */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900 md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.name || "User"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {uiRole} Dashboard
            </p>
          </div>
          <button
            type="button"
            className="rounded-md bg-white p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <HiMenuAlt3 className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-25 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-gray-900 md:hidden",
          {
            "translate-x-0": isMobileMenuOpen,
            "translate-x-full": !isMobileMenuOpen,
          }
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Navigation
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <div className="space-y-1">
              {allowedLinks.map((link) => (
                <NavLink key={`${link.name}-${link.href}`} link={link} />
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {(user?.name && user.name.charAt(0).toUpperCase()) || "U"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || "User Name"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {uiRole} Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
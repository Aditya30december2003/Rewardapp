"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { usePathname } from "next/navigation";

// Icons
import { RxDashboard } from "react-icons/rx";
import { FaUsersCog, FaKey } from "react-icons/fa";
import { TbUserPentagon } from "react-icons/tb";
import { BsGift, BsCreditCard } from "react-icons/bs";
import { 
  MdSupportAgent, 
  MdOutlineCampaign, 
  MdOutlineSettings,
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

// Link configuration for tenant routes
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
  
  // Superadmin links
  { name: "Overview", href: "overview", icon: RxDashboard, allow: ["superadmin"], group: "main" },
  { name: "User Management", href: "users-management", icon: FaUsersCog, allow: ["superadmin"], group: "main" },
  
  // Settings links (shared)
  { name: "Update Password", href: "password/update", icon: RiLockPasswordLine, allow: ["user", "admin"], group: "settings" },
  { name: "API Keys", href: "api-keys", icon: FaKey, allow: ["admin"], group: "settings" },
];

export default function TenantSideNav({ user, uiRole, basePrefix, PremiumPlan = false }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter links based on the user's role
  const allowedLinks = useMemo(
    () => tenantLinks.filter((link) => link.allow.includes(uiRole)),
    [uiRole]
  );

  const mainLinks = allowedLinks.filter((l) => l.group === "main");
  const settingsLinks = allowedLinks.filter((l) => l.group === "settings");

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
      {/* Mobile Menu Button */}
      <button
        className="fixed top-0 right-0 z-50 m-3 rounded-full bg-gray-800 p-2 text-white shadow-lg md:hidden"
        onClick={() => setIsMobileMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
      </button>

      {/* Sidebar Content */}
      <div className="flex h-full flex-col">
        {/* Logo/Header */}
        <div style={{ marginTop: "8%" }} className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
          <Link href={`${basePrefix}/${uiRole}/overview`}>
            <Image 
              src="/logo.png" 
              alt="App Logo" 
              width={100} 
              height={100} 
              priority
              className="object-contain"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-4 overflow-y-auto p-4 sidebar-scroll bg-gray-900">
          {/* Debug Info - Remove in production */}
          {/* <div className="text-xs text-gray-500 p-2 bg-gray-800 rounded">
            <p>Role: {uiRole}</p>
            <p>User: {user?.email}</p>
            <p>Prefix: {basePrefix}</p>
          </div> */}

          {mainLinks.length > 0 && (
            <div>
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Main
              </p>
              <div className="space-y-1">
                {mainLinks.map((link) => (
                  <NavLink key={`${link.name}-${link.href}`} link={link} />
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
                  <NavLink key={`${link.name}-${link.href}`} link={link} />
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-gray-800 p-4 bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 font-bold">
              {(user?.name && user.name.charAt(0).toUpperCase()) || "U"}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name || "User Name"}</p>
              <p className="text-xs text-gray-400">{user?.email || "user@example.com"}</p>
              <p className="text-xs text-sky-400 capitalize">{uiRole}</p>
            </div>
          </div>
        </div>
      </div>

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
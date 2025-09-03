// src/app/(protected)/(tenant)/layout.jsx
// Tenant-specific layout with team membership-based roles

import React from "react";
import { cookies } from "next/headers";
import { createSessionClient, createAdminClient } from "@/appwrite/config";
import TenantSideNav from "@/components/ui/sidebar/TenanatSideNav";
import TenantMobileTopMenu from "@/components/ui/sidebar/TenantMobileTopMenu";
import Footer from "@/components/Footer";
import UserMenu from "@/components/ui/UserMenu";

const TENANTS_DB = process.env.NEXT_PUBLIC_Tenants_DATABASE_ID;
const TENANTS_COL = process.env.NEXT_PUBLIC_Tenants_COLLECTION_ID;

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

function TenantHeaderBar({ user, tenantSlug }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-gray-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-7 text-slate-900 sm:truncate sm:tracking-tight dark:text-white">
              Welcome back, {user?.name || "Guest"}!
            </h1>
            <p className="hidden md:block mt-1 text-sm text-slate-500 dark:text-slate-400">
              Managing {tenantSlug} workspace
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

/* ---------- Tenant Role Detection ---------- */

async function getTenantData(user, tenantSlug) {
  try {
    console.log("=== TENANT LAYOUT DEBUG ===");
    console.log("User ID:", user.$id);
    console.log("User Email:", user.email);
    console.log("Tenant Slug:", tenantSlug);

    const { databases, users } = createAdminClient();
    const { Query } = await import("node-appwrite");
    
    // Get team ID from tenant slug
    const tenantDocs = await databases.listDocuments(TENANTS_DB, TENANTS_COL, [
      Query.equal("slug", tenantSlug)
    ]);
    
    const teamId = tenantDocs.documents?.[0]?.teamId;
    console.log("Team ID from tenant:", teamId);
    
    if (!teamId) {
      console.log("❌ No team ID found for tenant");
      return { uiRole: "user", error: "No team found" };
    }

    // Get user's memberships
    const memberships = await users.listMemberships(user.$id);
    console.log("User memberships count:", memberships.memberships.length);
    
    // Find membership for this specific team
    const membership = memberships.memberships.find((m) => {
      const membershipTeamId = m.teamId || m.team?.$id || m.$teamId;
      console.log("Checking membership team ID:", membershipTeamId, "vs target:", teamId);
      return membershipTeamId === teamId;
    });

    console.log("Found membership:", membership ? "✅ Yes" : "❌ No");
    
    if (!membership) {
      console.log("❌ User is not a member of this team");
      return { uiRole: "user", error: "Not a team member" };
    }

    const roles = Array.isArray(membership.roles) ? membership.roles : [];
    console.log("Membership roles:", roles);
    
    const isAdmin = roles.some(r => /^(owner|admin)$/i.test(r));
    console.log("Is admin?", isAdmin);
    console.log("Admin roles found:", roles.filter(r => /^(owner|admin)$/i.test(r)));
    
    const uiRole = isAdmin ? "admin" : "user";
    console.log("Final UI Role:", uiRole);
    console.log("=== END TENANT LAYOUT DEBUG ===");

    return {
      uiRole,
      teamId,
      membership,
      tenantDoc: tenantDocs.documents[0]
    };
    
  } catch (error) {
    console.error("❌ Error in getTenantData:", error);
    return { uiRole: "user", error: error.message };
  }
}

/* ---------------------------------------- */

export default async function TenantLayout({ children, params }) {
  // Extract tenant slug from params
  const tenantSlug = params?.tenant;
  
  if (!tenantSlug) {
    return <div>Error: No tenant specified</div>;
  }

  // Get authenticated user
  const jwt = cookies().get("session")?.value;
  if (!jwt) {
    return <div>Error: Not authenticated</div>;
  }

  const { account } = createSessionClient(jwt);
  const user = await account.get();

  // Get tenant-specific data and role
  const tenantData = await getTenantData(user, tenantSlug);
  const basePrefix = `/t/${tenantSlug}`;

  // Get tenant premium status (you can customize this logic)
  let PremiumPlan = false;
  try {
    if (tenantData.tenantDoc) {
      PremiumPlan = tenantData.tenantDoc.premiumPlan || false;
    }
  } catch (error) {
    console.error("Error checking premium status:", error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-gray-950 md:flex-row dark:bg-gradient-to-br dark:from-gray-950 dark:via-neutral-950 dark:to-gray-900">
      {/* Desktop sidebar - Tenant specific */}
      <aside className="fixed inset-y-0 z-50 hidden w-64 flex-col border-r border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-sm dark:border-gray-800/80 dark:bg-gray-900/60 md:flex">
        <div className="flex h-full flex-col">
          {/* <div
            style={{ backgroundColor: "black" }}
            className="flex h-20 items-center border-b border-slate-200/60 px-6 dark:border-gray-800/80"
          >
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 capitalize">
              {tenantSlug} Dashboard
            </h2>
          </div> */}
          <TenantSideNav 
            user={user} 
            uiRole={tenantData.uiRole} 
            basePrefix={basePrefix}
            PremiumPlan={PremiumPlan}
          />
        </div>
      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <TenantHeaderBar user={user} tenantSlug={tenantSlug} />
        <TenantMobileTopMenu 
          user={user} 
          uiRole={tenantData.uiRole}
          basePrefix={basePrefix}
          PremiumPlan={PremiumPlan}
        />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-xl bg-white/70 p-4 shadow-subtle ring-1 ring-slate-200/70 sm:p-6 dark:bg-gray-900/50 dark:shadow-none dark:ring-white/10">
              {children}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
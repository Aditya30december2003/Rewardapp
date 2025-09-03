
import { Suspense } from "react";
import {
  CardsSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/components/ui/skeletons";
import { AdminCardData } from "@/components/adminui/DashboardCards";
import RevenueChart from "@/components/admin/RevenueChart";
import LatestRegistrations from "@/components/admin/LatestRegistrations";
import { createAdminClient } from "@/appwrite/config";
import auth from "@/lib/auth";

export const metadata = { title: "Overview" };

export default async function OverviewPage({ params }) {
  console.log("🔧 Full params object:", params);
  console.log("🔧 Tenant slug:", params?.tenant);
  
  // If tenant is undefined, return early with debug info
  if (!params?.tenant) {
    return (
      <main>
        <div>
          <h1>Debug Info</h1>
          <p>Params: {JSON.stringify(params)}</p>
          <p>Expected URL format: /t/[tenant]/admin/overview</p>
          <p>Current URL should have a tenant slug like: /t/teamb/admin/overview</p>
        </div>
      </main>
    );
  }

  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);
    
    const tenantSlug = params.tenant;
    console.log("🔧 Looking for tenant with slug:", tenantSlug);

    // Rest of your code...
    
  } catch (error) {
    console.error("❌ Error:", error);
    return (
      <main>
        <div>Error: {error.message}</div>
      </main>
    );
  }
  const { users, databases } = await createAdminClient();
  const user = await auth.getUser();
  const prefs = await users.getPrefs(user.$id);
  
  // Get tenant slug from params
  const tenantSlug = params?.tenant;

  // Debug (only in dev)
  if (process.env.NODE_ENV !== "production") {
    console.log("👤 admin/overview -> user:", user?.$id, user?.email);
    console.log("👤 admin/overview -> prefs:", prefs);
    console.log("👤 admin/overview -> tenant slug:", tenantSlug);
  }

  // Fetch tenant document using the tenant slug from URL params
  let tenantDoc = null;
  
  if (tenantSlug) {
    try {
      const { Query } = await import("node-appwrite");
      
      // Query tenants collection by slug
      const tenantResult = await databases.listDocuments(
        process.env.NEXT_PUBLIC_Tenants_DATABASE_ID,
        process.env.NEXT_PUBLIC_Tenants_COLLECTION_ID,
        [Query.equal("slug", tenantSlug)]
      );
      
      if (tenantResult.documents.length > 0) {
        tenantDoc = tenantResult.documents[0];
        
        if (process.env.NODE_ENV !== "production") {
          console.log("✅ Found tenant document:", tenantDoc.name);
        }
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn("⚠️ No tenant found with slug:", tenantSlug);
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("⚠️ Failed to fetch tenant document:", err?.message);
      }
    }
  } else {
    // Fallback: try to get tenant from user prefs if no slug in URL
    if (prefs?.tenantId) {
      try {
        tenantDoc = await databases.getDocument(
          process.env.NEXT_PUBLIC_Tenants_DATABASE_ID,
          process.env.NEXT_PUBLIC_Tenants_COLLECTION_ID,
          prefs.tenantId // document id stored in user prefs
        );
        
        if (process.env.NODE_ENV !== "production") {
          console.log("✅ Found tenant from user prefs:", tenantDoc.name);
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("⚠️ Failed to fetch tenant from prefs:", err?.message);
        }
      }
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "ℹ️ No tenant slug in URL and no prefs.tenantId found. " +
            "Consider adding tenantId (document id) to user prefs during onboarding."
        );
      }
    }
  }

  // Use tenant's bodyColor or fallback to default
  const bodyColor = tenantDoc?.bodyColor || "#6366f1";

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-xl">
        {tenantDoc?.name ? `${tenantDoc.name} Overview` : "Users Overview"}
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Suspense fallback={<CardsSkeleton />}>
          <AdminCardData />
        </Suspense>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart bodyColor={bodyColor} />
        </Suspense>

        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestRegistrations />
        </Suspense>
      </div>
    </main>
  );
}
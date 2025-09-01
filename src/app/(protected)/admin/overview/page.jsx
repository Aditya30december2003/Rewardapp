import { Suspense } from "react";
import {
  CardsSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/components/ui/skeletons";
import { AdminCardData } from "@/components/adminui/DashboardCards";
import RevenueChart from "@/components/admin/RevenueChart";
import LatestRegistrations from "@/components/admin/LatestRegistrations";
import { createAdminClient } from "../../../../appwrite/config";
import auth from "../../../../lib/auth";

export const metadata = { title: "Overview" };

export default async function OverviewPage() {
  const { users, databases } = await createAdminClient();
  const user = await auth.getUser();
  const prefs = await users.getPrefs(user.$id);

  // ── Debug (only in dev)
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("👤 admin/overview -> user:", user?.$id, user?.email);
    // eslint-disable-next-line no-console
    console.log("👤 admin/overview -> prefs:", prefs);
  }

  // We *optionally* fetch the subscriber document if we know its doc id.
  // Store this as prefs.subscriberId during onboarding/registration.
  let subscriberDoc = null;

  if (prefs?.subscriberId) {
    try {
      subscriberDoc = await databases.getDocument(
        process.env.NEXT_PUBLIC_SUBSCRIPTION_DATABASE_ID,
        process.env.NEXT_PUBLIC_SUBSCRIBERS_COLLECTION_ID,
        prefs.subscriberId // <-- this must be the *document id* in Subscribers
      );
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("⚠️ Failed to fetch subscriber document:", err?.message);
      }
    }
  } else {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "ℹ️ No prefs.subscriberId found. Skip fetching subscriber doc. " +
          "Add subscriberId (the document id in your Subscribers collection) to user prefs during onboarding."
      );
    }
  }

  const bodyColor =
    subscriberDoc?.bodyColor ||
    "#6366f1"; // sensible default so charts still render

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-xl">Users Overview</h1>

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

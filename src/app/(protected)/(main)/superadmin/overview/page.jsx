import LatestRegistrations from "@/components/admin/LatestRegistrations";
import RevenueChart from "@/components/admin/RevenueChart";
import { AdminCardData, SuperAdminCardData } from "@/components/adminui/DashboardCards";
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/components/ui/skeletons";
import React from "react";
import { Suspense } from "react";

const page = () => {
  return (
    <main>
      <h1 className={` mb-4 text-xl md:text-xl`}>Users Overview</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Suspense fallback={<CardsSkeleton />}>
          <SuperAdminCardData />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {" "}
          <LatestRegistrations />
        </Suspense>
      </div>
    </main>
  );
};

export default page;

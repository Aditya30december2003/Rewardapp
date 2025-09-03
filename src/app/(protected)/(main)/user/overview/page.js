import { Suspense } from "react";
import {  CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/components/ui/skeletons";
import {  HRCardData, UserCardData } from "@/components/adminui/DashboardCards";
import RevenueChart from "@/components/user/dashboard/RevenueChart";
import LatestRegistrations from "@/components/user/dashboard/LatestRegistrations";
// import RevenueChart from "@/components/admin/RevenueChart";



export const metadata = {
  title: "Overview",
};

export default async function OverviewPage() {
  return (
    <main>
    <h1 className="mb-6 text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
  <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 bg-clip-text text-transparent">
    Dashboard
  </span>
</h1>

      <div style={{marginTop:"3.5%"}} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Suspense fallback={<CardsSkeleton />}>
          <UserCardData/>
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}> <LatestRegistrations/></Suspense>
       
      </div>
    </main>
  );
}

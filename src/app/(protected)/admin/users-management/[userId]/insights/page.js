import { Suspense } from "react";
import {
  CardsSkeleton,
  InvoiceSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/components/ui/skeletons";
import {
  HRCardData,
  UserCardData,
  UserInsights,
} from "@/components/adminui/DashboardCards";
import RevenueChart from "@/components/user/dashboard/RevenueChart";
import LatestRegistrations from "@/components/user/dashboard/LatestRegistrations";
import Breadcrumbs from "@/components/ui/Cases/Breadcrumbs";
import AllLeads from "@/components/user/dashboard/AllLeads";
import { fetchUserInsightsLevel } from "@/lib/data";
import LevelProgress from "@/components/user/account/LevelProgress";
import UserProfile from "@/components/admin/UserProfile";
// import RevenueChart from "@/components/admin/RevenueChart";

export const metadata = {
  title: "Overview",
};

export default async function OverviewPage({ params }) {
  const { userDetail, points, level, labels, tiers } =
    await fetchUserInsightsLevel(params.userId);

  const profileProps = {
    firstName: userDetail.firstName,
    lastName: userDetail.lastName,
    email:userDetail.email,
    company:userDetail.company,
    country:userDetail.country,
    phone:userDetail.phone,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/overview" },
          {
            label: "Users",
            href: "/admin/users-management",
          },
          {
            label: "User Insights",
            href: `/admin/users-management/${params.userId}/insights`,
          },
          {
            label: `${params.userId}`,
            href: `/admin/users-management/${params.userId}/insights`,
            active: true,
          },
        ]}
      />
      <div className=" mb-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <UserProfile {...profileProps}/>
        <LevelProgress currentLevel={level} points={points} labels={labels} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Suspense fallback={<CardsSkeleton />}>
          <UserInsights userId={params.userId} />
        </Suspense>
      </div>
      <div className="mt-6 ">
        {/* <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense> */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {" "}
          <AllLeads userId={params.userId} />
        </Suspense>
      </div>
    </main>
  );
}

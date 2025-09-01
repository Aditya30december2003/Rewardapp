import CouponRewardsList from "@/components/admin/CouponRewardsList";
import LevelTierList from "@/components/admin/LevelTierList";
import LevelTierContainer from "@/components/admin/LevelTierList";
import UsersTable from "@/components/admin/UsersTable";
import { fetchAllRewards } from "@/lib/data";
import { cookies } from "next/headers";

export default async function TiersManagementPage() {
  cookies();
  const rewards= await fetchAllRewards()
      


  return (
    <>
      <CouponRewardsList coupons={rewards}/>
    </>
  );
}

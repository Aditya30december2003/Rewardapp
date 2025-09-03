import CouponRewardsList from "@/components/admin/CouponRewardsList";
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

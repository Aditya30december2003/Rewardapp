import LevelProgress from "@/components/user/account/LevelProgress";
import GetReferCode from "@/components/user/referral/GetReferCode";
import RedeemPoints from "@/components/user/reward/RedeemPoints";
import { fetchAllRewards, fetchUserLevel } from "@/lib/data";
import { cookies } from "next/headers";

export default async function AccountPage() {
  cookies();
  const {points,level,labels,code}=await fetchUserLevel()
  const rewards=await fetchAllRewards()
  return (
    <div className="bg-white border flex-1 h-full rounded-xl flex max-md:flex-col overflow-hidden">
      <RedeemPoints points={points} rewards={rewards}/>
    </div>
  );
}

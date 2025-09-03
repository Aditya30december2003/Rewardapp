import ReferralLevelProgress from "@/components/user/account/ReferalLevelProgress";
import GetReferCode from "@/components/user/referral/GetReferCode";
import GetReferURL from "@/components/user/referral/GetReferURL";
import { fetchUserLevel } from "@/lib/data";
import { cookies } from "next/headers";

export default async function ReferralPage({ searchParams }) {
  cookies();
  const { referCode } = searchParams || {};
  const { points, level, labels, code } = await fetchUserLevel();

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-10 max-w-7xl mx-auto space-y-8">


      <ReferralLevelProgress
        currentLevel={level}
        points={points}
        labels={labels}
      />
      <div style={{marginTop:"9%"}} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full">
          <GetReferCode code={code} referCodetest={referCode} />
        </div>
        <div className="w-full">
          <GetReferURL code={code} />
        </div>
      </div>


    </div>
  );
}

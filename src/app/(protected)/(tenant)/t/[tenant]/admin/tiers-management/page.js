import LevelTierList from "@/components/admin/LevelTierList";
import { fetchAllTiers } from "@/lib/data";
import { cookies } from "next/headers";

export default async function TiersManagementPage() {
  cookies();
  const tiersData=await fetchAllTiers()
      
  return (
    <>
      <LevelTierList tiersData={tiersData}/>
    </>
  );
}

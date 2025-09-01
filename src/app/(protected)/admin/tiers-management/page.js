import LevelTierList from "@/components/admin/LevelTierList";
import LevelTierContainer from "@/components/admin/LevelTierList";
import UsersTable from "@/components/admin/UsersTable";
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

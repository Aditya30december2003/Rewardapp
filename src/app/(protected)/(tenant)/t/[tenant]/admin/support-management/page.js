import { createAdminClient } from "@/appwrite/config";
import CouponRewardsList from "@/components/admin/CouponRewardsList";
import LevelTierList from "@/components/admin/LevelTierList";
import LevelTierContainer from "@/components/admin/LevelTierList";
import TicketView from "@/components/admin/TicketView";
import UsersTable from "@/components/admin/UsersTable";
import auth from "@/lib/auth";
import { fetchAllQueries } from "@/lib/data";
import { cookies } from "next/headers";

export default async function TiersManagementPage() {
  cookies();

  const { users, databases } = await createAdminClient();
  const user = await auth.getUser();
  const prefes = await users.getPrefs(user.$id);
  const currentUser = await databases.getDocument(
    process.env.NEXT_PUBLIC_SUBSCRIPTION_DATABASE_ID,
    process.env.NEXT_PUBLIC_SUBSCRIBERS_COLLECTION_ID,
    prefes.dbId
  );
  

  const tickets=await fetchAllQueries()
      
  return (
    <>

      <TicketView bodyColor={currentUser.bodyColor} tickets={tickets} />;
    </>
  );
}

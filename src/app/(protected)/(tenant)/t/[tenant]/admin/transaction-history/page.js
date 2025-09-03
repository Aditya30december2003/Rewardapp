import CouponRewardsList from "@/components/admin/CouponRewardsList";
import LevelTierList from "@/components/admin/LevelTierList";
import LevelTierContainer from "@/components/admin/LevelTierList";
import TransactionHistory from "@/components/admin/TransactionHistory";
import UsersTable from "@/components/admin/UsersTable";
import { fetchAllTransactions } from "@/lib/data";
import { cookies } from "next/headers";

export default async function TiersManagementPage() {
  cookies();
  const transactions=await fetchAllTransactions()
      
  // const sampleTransactions = [
  //   {
  //     userName: "Alice Johnson",
  //     userEmail: "alice@example.com",
  //     couponCode: "DISCOUNT20",
  //     pointsSpent: 200,
  //   },
  //   {
  //     userName: "Bob Smith",
  //     userEmail: "bob@example.com",
  //     couponCode: "SUMMER15",
  //     pointsSpent: 150,
  //   },
  //   {
  //     userName: "Charlie Lee",
  //     userEmail: "charlie@example.com",
  //     couponCode: "WELCOME10",
  //     pointsSpent: 100,
  //   },
  //   {
  //     userName: "David Brown",
  //     userEmail: "david@example.com",
  //     couponCode: "BLACKFRIDAY25",
  //     pointsSpent: 250,
  //   },
  // ];
  return (
    <>
<TransactionHistory transactions={transactions} />
    </>
  );
}

import CreateUserForm from "@/components/adminui/CreateUser";
import Breadcrumbs from "@/components/ui/Cases/Breadcrumbs";
import ComplaintForm from "@/components/user/support/ComplaintForm";
import UserTickets from "@/components/user/support/UserTickets";
import { fetchUserDetails } from "@/lib/data";
import { cookies } from "next/headers";

export default async function Page() {
  cookies();
  
  // Destructure with default values to handle undefined response
  const { queries = [], $id = null } = (await fetchUserDetails()) || {};
  
  return (
    <main>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/user/overview" },
          {
            label: "Register Complaint",
            href: "/admin/create-user",
            active: true,
          },
        ]}
      /> */}
      {/* <ComplaintForm/> */}
      <UserTickets tickets={queries} userId={$id} />
    </main>
  );
}
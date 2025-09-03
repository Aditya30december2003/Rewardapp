import CreateUserForm from "@/components/adminui/CreateUser";
import Breadcrumbs from "@/components/ui/Cases/Breadcrumbs";
import UpdatePassword from "@/components/user/password/UpdatePassword";
import ComplaintForm from "@/components/user/support/ComplaintForm";
import UserTickets from "@/components/user/support/UserTickets";
import { fetchUserDetails } from "@/lib/data";
import { cookies } from "next/headers";

export default async function Page() {
  cookies();
   
  try {
    const userDetails = await fetchUserDetails();
    
    // Handle case where fetchUserDetails returns undefined or null
    if (!userDetails) {
      console.error('fetchUserDetails returned undefined');
      return (
        <main>
          <Breadcrumbs
            breadcrumbs={[
              { label: "Dashboard", href: "/user/overview" },
              {
                label: "Update Password",
                href: "/password/reset",
                active: true,
              },
            ]}
          />
          <div className="p-4">
            <p>Unable to load user details. Please try again later.</p>
          </div>
        </main>
      );
    }
    
    // Destructure with default values as fallback
    const { queries = [], $id = null, email = '' } = userDetails;
    
    // console.log("username", email)
    
    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: "Dashboard", href: "/user/overview" },
            {
              label: "Update Password",
              href: "/user/password/update",
              active: true,
            },
          ]}
        />
        {/* <ComplaintForm/> */}
        <UpdatePassword userId={$id} Useremail={email} /> 
      </main>
    );
  } catch (error) {
    console.error('Error fetching user details:', error);
    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: "Dashboard", href: "/user/overview" },
            {
              label: "Update Password",
              href: "/user/password/update",
              active: true,
            },
          ]}
        />
        <div className="p-4">
          <p>An error occurred while loading user details.</p>
        </div>
      </main>
    );
  }
}
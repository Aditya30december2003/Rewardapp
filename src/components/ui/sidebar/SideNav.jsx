import Link from "next/link";
import LogoutBtn from "./LogoutBtn";
import NavLinks from "./NavLinks";
import auth from "@/lib/auth";
import { createAdminClient } from "@/lib/server/appwrite";

export default async function SideNav() {
  const { users, databases } = await createAdminClient();
  const user = await auth.getUser();
  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.labels?.[0] === "admin" || (user.labels?.[0] === "user" && user.name !== "Demo")) {
    try {
      const prefes = await users.getPrefs(user.$id);
      
      // Check if dbId exists in preferences
      if (!prefes.dbId) {
        console.warn("User preferences missing dbId:", prefes);
        // Fall back to default/demo layout
        return renderDefaultSideNav(user);
      }

      const currentUser = await databases.getDocument(
        process.env.SUBSCRIPTION_DATABASE_ID

,
        process.env.SUBSCRIBERS_COLLECTION_ID

,
        prefes.dbId
      );

      const PremiumPlan = currentUser.PremiumPlan;
      const bodyColor = currentUser.bodyColor;
      const accentColor = currentUser.accentColor;
      const logoId = currentUser.logoId;
      const BuckedId = process.env.LOGOS_STORAGE_ID


;
      const appwriteUrl = process.env.NEXT_PUBLIC_ENDPOINT;
      const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

      const logo = `${appwriteUrl}/storage/buckets/${BuckedId}/files/${logoId}/view?project=${projectId}&project=${projectId}&mode=admin`;

      return (
        <div
          className="flex h-full flex-col px-3 py-4 md:px-2 "
          style={{ backgroundColor: bodyColor || "#AE6AF5" }}
        >
          <Link
            className="mb-2 flex h-20 items-center justify-center rounded-md custom-gradient backdrop-blur-2xl  md:p-4 md:h-40"
            href="/"
            style={{
              backgroundImage: `linear-gradient(to top, ${bodyColor}, ${accentColor})`,
            }}
          >
            <img
              src={logoId ? logo : "/logowhite.png"}
              alt="Perktify-logo"
              className=" w-[120px] md:w-[150px] object-cover"
            />
          </Link>
          <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
            <NavLinks
              user={user}
              accentColor={accentColor}
              bodyColor={bodyColor}
              PremiumPlan={PremiumPlan}
            />
            <div className="hidden h-auto w-full grow rounded-md  md:block"></div>
            <LogoutBtn />
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error fetching user preferences or document:", error);
      // Fall back to default layout on error
      return renderDefaultSideNav(user);
    }
  } else {
    return renderDefaultSideNav(user);
  }
}

// Helper function to render default sidebar
function renderDefaultSideNav(user) {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 ">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md custom-gradient backdrop-blur-2xl  md:p-4 md:h-40"
        href="/"
      >
        <img
          src="/logowhite.png"
          alt="Perktify-logo"
          className=" w-[120px] md:w-[150px] object-cover"
        />
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks user={user} />
        <div className="hidden h-auto w-full grow rounded-md  md:block"></div>
        <LogoutBtn />
      </div>
    </div>
  );
}
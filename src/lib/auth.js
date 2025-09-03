// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { createSessionClient } from "../appwrite/config";

// const auth = {
//   user: null,
//   sessionCookie: null,
//   getUser: async () => {
//     auth.sessionCookie = cookies().get("session");
//     // console.log("SEssion",auth.sessionCookie.value)
//     try {
//       const { account } = await createSessionClient(auth.sessionCookie.value);
    
//       auth.user = await account.get();
//       // cookies().delete("challengeID");
//       return auth.user;
//     } catch (error) {
//       if (error.type === `user_more_factors_required`) {
//         // redirect to verify MFA
//         if (cookies().get("challengeID")?.value) {
//           return {
//             mfa: "verify",
//             message: `/verify/OTP`,
//             // message: `/verify/${cookies().get("challengeID")?.value}`,
//           };
//         } else {
//           try {
//             // redirect to perform MFA
//             const { account } = await createSessionClient(
//               auth.sessionCookie.value
//             );

//             const challenge = await account.createMfaChallenge(
//               "email" // factor
//             );

//             console.log("OTP sent Successfully with ID",challenge.$id)
//             cookies().set("challengeID", challenge.$id);

//             return {
//               mfa: "verify",
//               // message: `/verify/${challenge.$id}`,
//               message: `/verify/OTP`,
//             };
//           } catch (error) {
//             return {
//               mfa: "error",
//               message: error.message,
//             };

//           }
//         }
//         // // redirect to perform MFA
//         // const { account } = await createSessionClient(auth.sessionCookie.value);
//         // const challenge = await account.createMfaChallenge(
//         //   "email" // factor
//         // );
//         // redirect(`/verify/${challenge.$id}`);
      
//       } else {
//         // handle other errors
//         auth.user = null;
//         auth.sessionCookie = null;
//       }
//     }
//     return auth.user;
//   },
//   deleteSession: async () => {
//     "use server";
//     auth.sessionCookie = cookies().get("session");
//     try {
//       const { account } = await createSessionClient(auth.sessionCookie.value);
//       await account.deleteSession("current");
//     } catch (error) {}

//     cookies().delete("session");
//     //  cookies().delete("challengeID");
//     auth.user = null;
//     auth.sessionCookie = null;
//     redirect("/login");
//   },
// };

// export default auth;

// lib/auth.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionClient } from "../appwrite/config";
import { createAdminClient } from "@/appwrite/config";

// You need to define these constants - replace with your actual values
const TENANTS_DB = process.env.NEXT_PUBLIC_Tenants_DATABASE_ID
const TENANTS_COL =process.env.NEXT_PUBLIC_Tenants_COLLECTION_ID

/**
 * Get the roles a user has within a tenant, by slug.
 * @param userId Appwrite user $id
 * @param slug   Tenant slug (e.g., "acme-dental")
 * @returns      Array of role strings, e.g. ["owner"], ["admin"], ["member"]
 */
export async function getRolesForTenant(userId, slug) {
  try {
    const { databases, users } = createAdminClient();
    const { Query } = await import("node-appwrite");

    // 1) find tenant by slug
    const tenantsResp = await databases.listDocuments(
      TENANTS_DB,
      TENANTS_COL,
      [Query.equal("slug", slug)]
    );
    
    const tenant = tenantsResp.documents[0];
    if (!tenant) {
      console.log(`No tenant found for slug: ${slug}`);
      return [];
    }

    // 2) list memberships for this user
    const membershipsResp = await users.listMemberships(userId);
    const memberships = membershipsResp.memberships || [];

    // 3) find membership for this tenant's teamId
    const membership = memberships.find((m) => {
      // Check all possible teamId properties
      return (
        m.teamId === tenant.teamId ||
        m.team?.$id === tenant.teamId ||
        m.$teamId === tenant.teamId
      );
    });

    return membership?.roles || [];
  } catch (error) {
    console.error("Error getting roles for tenant:", error);
    return [];
  }
}

const auth = {
  user: null,

  getUser: async () => {
    const cookie = cookies().get("session"); // stores JWT now
    if (!cookie?.value) return null;

    try {
      const { account } = await createSessionClient(cookie.value); // <-- setJWT inside
      const me = await account.get();
      auth.user = me;
      return me;
    } catch (err) {
      // MFA flow coming from Appwrite throws distinct error types
      if (err?.type === "user_more_factors_required") {
        const challengeId = cookies().get("challengeID")?.value;
        return {
          mfa: "verify",
          message: challengeId ? `/verify/OTP` : `/verify/OTP`,
        };
      }
      // not authenticated/invalid JWT
      auth.user = null;
      return null;
    }
  },

  // Add the getRolesForTenant method to the auth object
  getRolesForTenant: getRolesForTenant,

  deleteSession: async () => {
    "use server";
    cookies().delete("session");
    cookies().delete("challengeID");
    auth.user = null;
    redirect("/login");
  },
};

export default auth;
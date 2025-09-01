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

  deleteSession: async () => {
    "use server";
    cookies().delete("session");
    cookies().delete("challengeID");
    auth.user = null;
    redirect("/login");
  },
};

export default auth;

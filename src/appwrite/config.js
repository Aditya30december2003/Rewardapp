// // "@/appwrite/config.js"
// import { Client, Databases, Account, Storage, Users } from "node-appwrite";

// /** Utility: enable self-signed certs when APPWRITE_SELF_SIGNED=true */
// function applySelfSigned(client) {
//   if (String(process.env.APPWRITE_SELF_SIGNED).toLowerCase() === "true") {
//     client.setSelfSigned(true);
//   }
//   return client;
// }

// /** Admin client (server key) for your main Perktify project */
// export function createAdminClient() {
//   const client = applySelfSigned(
//     new Client()
//       .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)        // e.g. https://api.perktify.com/v1
//       .setProject(process.env.NEXT_PUBLIC_PROJECT_ID)
//       .setKey(process.env.APPWRITE_API_KEY)
//   );

//   return {
//     get client() { return client; },
//     get account() { return new Account(client); },
//     get users() { return new Users(client); },
//     get databases() { return new Databases(client); },
//     get storage() { return new Storage(client); },
//   };
// }

// /** Admin client (server key) for your StoreKwil project (if used) */
// export function storekwilAdminClient() {
//   const client = applySelfSigned(
//     new Client()
//       .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
//       .setProject(process.env.NEXT_PUBLIC_STOREKWIL_PROJECT_ID)
//       .setKey(process.env.STOREKWIL_API_KEY)
//   );

//   return {
//     get client() { return client; },
//     get databases() { return new Databases(client); },
//   };
// }

// /**
//  * Anonymous client (no user session) — use for password recovery,
//  * public reads, etc. (No cookies required.)
//  */
// export function createAnonClient() {
//   const client = applySelfSigned(
//     new Client()
//       .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
//       .setProject(process.env.NEXT_PUBLIC_PROJECT_ID)
//   );

//   return {
//     get client() { return client; },
//     get account() { return new Account(client); },
//     get databases() { return new Databases(client); },
//     get storage() { return new Storage(client); }, 
//   };
// }

// /**
//  * Session client (user session). Pass the **session secret** you set in the browser cookie.
//  * It tries `client.setSession(secret)` if your SDK supports it (newer versions),
//  * otherwise falls back to setting the Appwrite session cookie header manually.
//  */
// export function createSessionClient(sessionSecret) {
//   const client = applySelfSigned(
//     new Client()
//       .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
//       .setProject(process.env.NEXT_PUBLIC_PROJECT_ID)
//   );

//   if (sessionSecret) {
//     // Prefer the official method if available
//     if (typeof client.setSession === "function") {
//       client.setSession(sessionSecret);
//     } else {
//       // Fallback: set the Appwrite session cookie header
//       const cookieName = `a_session_${process.env.NEXT_PUBLIC_PROJECT_ID}`;
//       // Some SDK versions expose a headers map; defensively set it
//       const current = (client.headers ?? {});
//       client.headers = { ...current, cookie: `${cookieName}=${sessionSecret}` };
//     }
//   }

//   return {
//     get client() { return client; },
//     get account() { return new Account(client); },
//     get databases() { return new Databases(client); },
//     get storage() { return new Storage(client); },
//   };
// }

// appwrite/config.js
import { Client, Account, Databases, Storage, Teams, Users } from "node-appwrite";

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;           // e.g. https://hostsuite.teamhup.com/v1
const PROJECT  = process.env.NEXT_PUBLIC_PROJECT_ID;         // your project id
const API_KEY  = process.env.APPWRITE_API_KEY;               // server key

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT)
    .setKey(API_KEY);

  return {
    client,
    account:   new Account(client),
    databases: new Databases(client),
    storage:   new Storage(client),
    teams:     new Teams(client),
    users:     new Users(client),
  };
}

/**
 * Create a server-side client **using a JWT** (minted by Web SDK).
 * Pass the JWT string, not a session secret.
 */
export function createSessionClient(jwt) {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT);

  if (jwt) client.setJWT(jwt); // IMPORTANT: use JWT, not setSession

  return {
    client,
    account:   new Account(client),
    databases: new Databases(client),
    storage:   new Storage(client),
    teams:     new Teams(client),
  };
}

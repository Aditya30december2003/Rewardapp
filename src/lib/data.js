import { createAdminClient, storekwilAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import auth from "./auth";
// --- put near the top of lib/data.js ---

/** Resolve an absolute base URL for server-side fetches */
function getBaseUrl() {
  // Prefer explicit envs when available
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.APP_URL) return process.env.APP_URL;

  // Fallback to Vercel/Render conventions
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Final fallback for local dev
  return "http://localhost:3000";
}

/** Read cookies header in server context (no-op on edge/client) */
function getCookieHeader() {
  try {
    const c = cookies();
    // Serialize cookies into a single header value
    const kv = [];
    for (const c0 of c.getAll()) {
      kv.push(`${c0.name}=${encodeURIComponent(c0.value)}`);
    }
    return kv.join("; ");
  } catch {
    return "";
  }
}


export async function fetchAllLabelledUsers(query) {
  try {
    const { users } = await createAdminClient();

    const response = await users.list([Query.contains("labels", [query])]);
    return response.users;
  } catch (error) {
    console.error("ERROR in fetchAllLabelledUsers", error);
    return;
  }
}
//super admin cards
export async function fetchSuperAdminCardData() {
  try {
    const documents = await fetchAllUsers();
    // console.log("all user documents ", documents);

    // Calculate values with fallback to zero if empty
    const users = documents.length || 0;

    const direct = documents.filter((user) => !user.isRefferedLead).length || 0;

    const referred =
      documents.filter((user) => user.isRefferedLead).length || 0;

    const currentMonth = new Date().getMonth();
    const monthly =
      documents.filter((user) => {
        const createdAt = new Date(user.$createdAt);
        return createdAt.getMonth() === currentMonth;
      }).length || 0;

    return {
      users,
      direct,
      referred,
      monthly,
    };
  } catch (error) {
    console.error("fetchAdminCardData:", error);
    return {
      users: 0,
      direct: 0,
      referred: 0,
      monthly: 0,
    };
  }
}
// Storekwill Admin Functions
export async function fetchAdminCardData() {
  try {
    const documents = await fetchAllUsers();
    // console.log("all user documents ", documents);

    // Calculate values with fallback to zero if empty
    const users = documents.length || 0;

    const direct = documents.filter((user) => !user.isRefferedLead).length || 0;

    const referred =
      documents.filter((user) => user.isRefferedLead).length || 0;

    const currentMonth = new Date().getMonth();
    const monthly =
      documents.filter((user) => {
        const createdAt = new Date(user.$createdAt);
        return createdAt.getMonth() === currentMonth;
      }).length || 0;

    return {
      users,
      direct,
      referred,
      monthly,
    };
  } catch (error) {
    console.error("fetchAdminCardData:", error);
    return {
      users: 0,
      direct: 0,
      referred: 0,
      monthly: 0,
    };
  }
}
export async function fetchLeadsAnalytics() {
  try {
    const documents = await fetchAllUsers();

    // Initialize an object to store registration counts for each month
    const monthlyData = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    // Populate monthlyData with the number of registrations per month
    documents.forEach((user) => {
      const createdAt = new Date(user.$createdAt);
      const month = createdAt.toLocaleString("en-US", { month: "short" });
      if (monthlyData[month] !== undefined) {
        monthlyData[month]++;
      }
    });

    // Convert monthlyData object to the desired array format
    const analyticsData = Object.entries(monthlyData).map(
      ([month, userRegistrations]) => ({
        month,
        userRegistrations,
      })
    );

    return analyticsData;
  } catch (error) {
    console.error("Error fetching leads analytics:", error);
    throw new Error("Failed to fetch leads analytics.");
  }
}
export async function fetchLatestRegistrations() {
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    const response = await databases.listDocuments(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.USERS_COLLECTION_ID,
      prefs.dbId,
      prefs.Users,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllUsers", error);
    return;
  }
}
// User Management
// export async function fetchAllUsers(filters = {}) {
//   const { query, queryType } = filters;

//   try {
//     const { users, databases } = await createAdminClient();
//     if(query==="" || queryType===""){
//       const response = await databases.listDocuments(
//         process.env.NEXT_PUBLIC_DATABASE_ID,
//         process.env.USERS_COLLECTION_ID

//       );
//       return response.documents;
//     }else{
//       const response = await databases.listDocuments(
//         process.env.NEXT_PUBLIC_DATABASE_ID,
//         process.env.USERS_COLLECTION_ID
//         [ Query.contains(queryType, query)]
//       );
//       return response.documents;
//     }
//   } catch (error) {
//     console.error("ERROR in fetchAllUsers", error);
//     return;
//   }
// }
// Teir Management
export async function fetchAllTiers() {
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    const response = await databases.listDocuments(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.TIERS_COLLECTION_ID
      prefs.dbId,
      prefs.tiers
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllTiers", error);
    return;
  }
}
// Rewards Management
export async function fetchAllRewards() {
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    const response = await databases.listDocuments(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.REWARDS_COLLECTION_ID
      prefs.dbId,
      prefs.rewards
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllRewards", error);
    return;
  }
}

// Marrketing Material Mannagement
export async function fetchAllMaterials() {
  try {
    const { storage } = await createAdminClient();

    const response = await storage.listFiles(
      process.env.MARKETING_MATERIAL_STORAGE_ID


    );

    return response.files;
  } catch (error) {
    console.error("ERROR in fetchAllMaterials", error);
    return;
  }
}

// Transactions History Management
export async function fetchAllTransactions() {
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    const response = await databases.listDocuments(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.TRANSACTIONS_COLLECTION_ID
      prefs.dbId,
      prefs.transactions
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllTransactions", error);
    return;
  }
}
// Queries Managemnet History Management
export async function fetchAllQueries() {
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    const response = await databases.listDocuments(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.QUERIES_COLLECTION_ID
      prefs.dbId,
      prefs.queries
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllQueries", error);
    return;
  }
}
// Compaigns Managemnet History Management
export async function fetchAllCompaigns() {
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    const response = await databases.listDocuments(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.COMPAIGNS_COLLECTION_ID
      prefs.dbId,
      prefs.campaigns
    );
    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllCompaigns", error);
    return;
  }
}

//Storekwill user function
export async function fetchUserCardData() {
  try {
    const userDetail = await fetchUserDetails();

    // Calculate total earned points by summing up all points in earnedPoints array
    
    const points = userDetail.earnedPoints.reduce(
      (total, entry) => total + entry.points,
      0
    );

    // Calculate used points by summing up all points used in transactions
    const used = userDetail.transactions.reduce((total, transaction) => {
      return total + (transaction.coupon?.pointsRequired || 0);
    }, 0);

    // Calculate available points as total earned points minus used points
    const available = points - used;

    // Calculate the number of leads referred by the user
    const leads = userDetail.lead ? userDetail.lead.length : 0;

    return {
      points,
      leads,
      available,
      used,
    };
  } catch (error) {
    console.error("fetchUserCardData:", error);
    return {
      points: 0,
      leads: 0,
      available: 0,
      used: 0,
    };
  }
}
//Storekwill user function
export async function fetchUserInsights(userId) {
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    const userDetail = await databases.getDocument(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.USERS_COLLECTION_ID,
      prefs.dbId,
      prefs.Users,
      userId
    );

    // Calculate total earned points by summing up all points in earnedPoints array
    const points = userDetail.earnedPoints.reduce(
      (total, entry) => total + entry.points,
      0
    );

    // Calculate used points by summing up all points used in transactions
    const used = userDetail.transactions.reduce((total, transaction) => {
      return total + (transaction.coupon?.pointsRequired || 0);
    }, 0);

    // Calculate available points as total earned points minus used points
    const available = points - used;

    // Calculate the number of leads referred by the user
    const leads = userDetail.lead ? userDetail.lead.length : 0;

    return {
      points,
      leads,
      available,
      used,
    };
  } catch (error) {
    console.error("fetchUserCardData:", error);
    return {
      points: 0,
      leads: 0,
      available: 0,
      used: 0,
    };
  }
}
export async function fetchUserLeadsAnalytics(userId) {
  const fallback = { total: 0, monthly: [], bySource: [] }; // <- adjust to your UI shape
  const base = getBaseUrl();

  // If your route differs, change the path here:
  const url = `${base}/api/leads/analytics${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        // If your API depends on session cookies, forward them in SSR/Route Handlers:
        ...(getCookieHeader() ? { cookie: getCookieHeader() } : {}),
      },
      // Avoid caching analytics unless you want ISR
      cache: "no-store",
      // If this is a Next.js Route Handler and you want dynamic:
      next: { revalidate: 0 },
    });

    // Non-2xx: log details and return fallback rather than throwing
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      /* eslint-disable */
      console.error(
        "[fetchUserLeadsAnalytics] HTTP", res.status, res.statusText,
        "URL:", url,
        "Body:", text?.slice(0, 500)
      );

      // Helpful branches by status
      if (res.status === 401 || res.status === 403) {
        // not authenticated/authorized – return empty dataset
        return fallback;
      }
      if (res.status === 404) {
        // endpoint or user not found – treat as empty
        return fallback;
      }
      // other errors – still avoid breaking UI
      return fallback;
    }

    // Try JSON parse with guard
    let data;
    try {
      data = await res.json();
    } catch (e) {
      console.error("[fetchUserLeadsAnalytics] JSON parse error", e);
      return fallback;
    }

    // Validate expected shape minimally
    if (!data || typeof data !== "object") return fallback;

    // Optionally normalize fields here
    const normalized = {
      total: Number(data.total ?? 0),
      monthly: Array.isArray(data.monthly) ? data.monthly : [],
      bySource: Array.isArray(data.bySource) ? data.bySource : [],
    };

    return normalized;
  } catch (error) {
    // Network/DNS/URL mistakes end up here. Log the *real* cause.
    console.error("[fetchUserLeadsAnalytics] Fetch failed:", error?.message || error, "URL:", url);
    return fallback; // do NOT throw; keep UI alive
  }
}

export async function fetchUserLatestRegistrations() {
  try {
    const userDetail = await fetchUserDetails();
    // console.log("userdetails", userDetail);

    // Static data for the demo user
    const staticDemoData = [
      {
        firstName: "John",
        lastName: "Doe",
        company: "Demo Corp",
        country: "USA",
        referralCode: "DEMO123",
        isRefferedLead: false,
        refferedBy: null,
        email: "john.doe@example.com",
        phone: "123456789",
        $id: "demo1",
        $createdAt: "2024-11-26T07:04:19.457+00:00",
        $updatedAt: "2024-11-26T11:28:01.176+00:00",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        company: "Tech Solutions",
        country: "UK",
        referralCode: "JANE456",
        isRefferedLead: true,
        refferedBy: "demo1",
        email: "jane.smith@example.com",
        phone: "987654321",
        $id: "demo2",
        $createdAt: "2024-11-27T10:12:39.365+00:00",
        $updatedAt: "2024-11-27T10:12:39.365+00:00",
      },
      {
        firstName: "Alice",
        lastName: "Brown",
        company: "Global Web",
        country: "Canada",
        referralCode: "ALICE789",
        isRefferedLead: false,
        refferedBy: null,
        email: "alice.brown@example.com",
        phone: "555123456",
        $id: "demo3",
        $createdAt: "2024-12-01T08:54:33.534+00:00",
        $updatedAt: "2024-12-01T08:54:33.534+00:00",
      },
      {
        firstName: "Michael",
        lastName: "Lee",
        company: "NextGen Ltd",
        country: "Australia",
        referralCode: "MICHAEL567",
        isRefferedLead: true,
        refferedBy: "demo3",
        email: "michael.lee@example.com",
        phone: "666987654",
        $id: "demo4",
        $createdAt: "2024-12-05T10:33:03.506+00:00",
        $updatedAt: "2024-12-05T10:33:03.506+00:00",
      },
      {
        firstName: "Sophia",
        lastName: "Wilson",
        company: "InnovateX",
        country: "Germany",
        referralCode: "SOPHIA234",
        isRefferedLead: false,
        refferedBy: null,
        email: "sophia.wilson@example.com",
        phone: "777654321",
        $id: "demo5",
        $createdAt: "2024-12-10T12:45:22.123+00:00",
        $updatedAt: "2024-12-10T12:45:22.123+00:00",
      },
    ];

    // Return static data if the user is the demo user
    if (userDetail.email === "demo@storekwil.com") {
      return staticDemoData;
    }

    // Sort the leads by creation date in descending order and take the first 5 entries
    const latestLeads = userDetail.lead
      .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
      .slice(0, 5)
      .map((lead) => lead.users);

    return latestLeads;
  } catch (error) {
    console.error("ERROR in fetchUserLatestRegistrations", error);
    return [];
  }
}
export async function fetchUserAllLeads(userId) {
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    const userDetail = await databases.getDocument(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.USERS_COLLECTION_ID,
      prefs.dbId,
      prefs.Users,
      userId
    );

    // Sort the leads by creation date in descending order and take the first 5 entries
    const latestLeads = userDetail.lead
      .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
      .map((lead) => lead.users);

    return latestLeads;
  } catch (error) {
    console.error("ERROR in fetchUserLatestRegistrations", error);
    return [];
  }
}

export async function fetchUserDetails() {
  try {
    // console.log("fetching User Details...")
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    // console.log("fetching User Document with ID",user?.$id)
    const response = await databases.getDocument(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.USERS_COLLECTION_ID,
      prefs.dbId,
      prefs.Users,
      user.$id
    );

    // console.log("Response is this:::::::",response)
    return response;
  } catch (error) {
    console.error("ERROR in fetchUserDetails", error);
    return;
  }
}

export async function fetchUserLevel() {
  try {
    const userDetail = await fetchUserDetails();

    // Return static data if the user is a demo user
    if (userDetail.email === "demo@storekwil.com") {
      return {
        points: 1002,
        level: 2,
        labels: ["Silver", "Bronze", "Gold"],
        tiers: [
          {
            label: "Silver",
            threshold: 100,
            $id: "67457ec1000c57571f63",
            $createdAt: "2024-11-26T07:54:41.214+00:00",
            $updatedAt: "2024-11-26T08:19:19.008+00:00",
            $permissions: [],
            $databaseId: "6745610e000cef76158e",
            $collectionId: "67457c890015b2988f6b",
          },
          {
            label: "Bronze",
            threshold: 1002,
            $id: "67457ecb00132fca3551",
            $createdAt: "2024-11-26T07:54:51.323+00:00",
            $updatedAt: "2024-11-26T17:45:56.137+00:00",
            $permissions: [],
            $databaseId: "6745610e000cef76158e",
            $collectionId: "67457c890015b2988f6b",
          },
          {
            label: "Gold",
            threshold: 2500,
            $id: "67457ed30027ee2a4e16",
            $createdAt: "2024-11-26T07:54:59.656+00:00",
            $updatedAt: "2024-11-26T16:24:04.262+00:00",
            $permissions: [],
            $databaseId: "6745610e000cef76158e",
            $collectionId: "67457c890015b2988f6b",
          },
        ],
        code: "DEMO6762",
      };
    }

    const tiers = await fetchAllTiers();

    // Calculate the user's total points
    const totalPoints = userDetail.earnedPoints.reduce(
      (sum, entry) => sum + entry.points,
      0
    );

    // Sort tiers by threshold in ascending order
    const sortedTiers = tiers.sort((a, b) => a.threshold - b.threshold);

    // Determine the user's level based on their total points
    let userLevel = "No Level";
    for (const tier of sortedTiers) {
      if (totalPoints >= tier.threshold) {
        userLevel = tier.label;
      } else {
        break; // Stop if the next threshold is higher than the total points
      }
    }

    // Determine the user's level index based on their total points
    let levelIndex = -1;
    for (let i = 0; i < sortedTiers.length; i++) {
      if (totalPoints >= sortedTiers[i].threshold) {
        levelIndex = i;
      } else {
        break; // Stop if the next threshold is higher than the total points
      }
    }

    const labels = tiers.map((tier) => tier.label);

    return {
      points: totalPoints,
      level: levelIndex + 1,
      labels,
      tiers,
      code: userDetail.referralCode,
    };
  } catch (error) {
    console.error("ERROR in fetchUserLevel", error);
    return { points: 0, level: "No Level" };
  }
}
export async function fetchUserInsightsLevel(userId) {
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    const userDetail = await databases.getDocument(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.USERS_COLLECTION_ID,
      prefs.dbId,
      prefs.Users,
      userId
    );
    const tiers = await fetchAllTiers();

    // Calculate the user's total points
    const totalPoints = userDetail.earnedPoints.reduce(
      (sum, entry) => sum + entry.points,
      0
    );

    // Sort tiers by threshold in ascending order
    const sortedTiers = tiers.sort((a, b) => a.threshold - b.threshold);

    // Determine the user's level based on their total points
    let userLevel = "No Level";
    for (const tier of sortedTiers) {
      if (totalPoints >= tier.threshold) {
        userLevel = tier.label;
      } else {
        break; // Stop if the next threshold is higher than the total points
      }
    }

    // Determine the user's level index based on their total points
    let levelIndex = -1;
    for (let i = 0; i < sortedTiers.length; i++) {
      if (totalPoints >= sortedTiers[i].threshold) {
        levelIndex = i;
      } else {
        break; // Stop if the next threshold is higher than the total points
      }
    }

    const labels = tiers.map((tier) => tier.label);

    return {
      points: totalPoints,
      level: levelIndex + 1,
      labels,
      tiers,
      code: userDetail.referralCode,
      userDetail: userDetail,
    };
  } catch (error) {
    console.error("ERROR in fetchUserLevel", error);
    return { points: 0, level: "No Level" };
  }
}

export async function fetchAllUsers(filters = {}) {
  const {
    query = "",
    queryType = "",
    dateFilterType,
    dateStart,
    dateEnd,
    pointsFilterType,
    pointsMin,
    pointsMax,
    pointsValue,
    order = "asc",
    limit = 25,
    offset = 0,
  } = filters;

  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    const queryFilters = [];

    // Query by text and type
    if (query && queryType) {
      queryFilters.push(Query.contains(queryType, query));
    }

    // Date filtering
    if (dateFilterType === "range" && dateStart && dateEnd) {
      queryFilters.push(
        Query.between(
          "$createdAt",
          new Date(dateStart).toISOString(),
          new Date(dateEnd).toISOString()
        )
      );
    } else if (dateFilterType === "dateAfter" && dateStart) {
      queryFilters.push(
        Query.greaterThan("$createdAt", new Date(dateStart).toISOString())
      );
    } else if (dateFilterType === "dateBefore" && dateStart) {
      queryFilters.push(
        Query.lessThan("$createdAt", new Date(dateStart).toISOString())
      );
    }

    // // Ordering
    // const orderQuery =
    //   order === "desc"
    //     ? Query.orderDesc("$createdAt")
    //     : Query.orderAsc("$createdAt");
    // queryFilters.push(orderQuery);

    // // Pagination
    // queryFilters.push(Query.limit(limit));
    // queryFilters.push(Query.offset(offset));

    // console.log("queryFilters",queryFilters)

    // Fetch the documents with filters

    const response = await databases.listDocuments(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.USERS_COLLECTION_ID,
      prefs.dbId,
      prefs.Users,
      [...queryFilters, Query.limit(1000)]
    );
    // return response;
    // Calculate totalPoints and append to each document
    response.documents.forEach((doc) => {
      // console.log("earnedPoints for doc", doc.$id, ":", doc.earnedPoints);
      const pointsArray = Array.isArray(doc.earnedPoints) ? doc.earnedPoints : [];
      const totalPoints = pointsArray.reduce(
        (sum, entry) => sum + entry.points,
        0
      );
      doc.totalPoints = totalPoints;
    });

    // Apply filters to the computed totalPoints
    let filteredDocuments = response.documents;

    if (pointsFilterType === "range" && pointsMin && pointsMax) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.totalPoints >= pointsMin && doc.totalPoints <= pointsMax
      );
    } else if (pointsFilterType === "pointsGreaterThan" && pointsValue) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.totalPoints > pointsValue
      );
    } else if (pointsFilterType === "pointsLessThan" && pointsValue) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.totalPoints < pointsValue
      );
    } else if (pointsFilterType === "pointsEqual" && pointsValue) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.totalPoints === pointsValue
      );
    }

    return filteredDocuments;

    // return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllUsers", error);
    return [];
  }
}

export async function fetchAllWaitlistUsers(filters = {}) {
  const {
    query = "",
    queryType = "",
    dateFilterType,
    dateStart,
    dateEnd,
    pointsFilterType,
    pointsMin,
    pointsMax,
    pointsValue,
    order = "asc",
    limit = 25,
    offset = 0,
  } = filters;

  try {
    const { databases } = await storekwilAdminClient();
    const queryFilters = [];

    // Query by text and type
    if (query && queryType) {
      queryFilters.push(Query.contains(queryType, query));
    }

    // Date filtering
    if (dateFilterType === "range" && dateStart && dateEnd) {
      queryFilters.push(
        Query.between(
          "$createdAt",
          new Date(dateStart).toISOString(),
          new Date(dateEnd).toISOString()
        )
      );
    } else if (dateFilterType === "dateAfter" && dateStart) {
      queryFilters.push(
        Query.greaterThan("$createdAt", new Date(dateStart).toISOString())
      );
    } else if (dateFilterType === "dateBefore" && dateStart) {
      queryFilters.push(
        Query.lessThan("$createdAt", new Date(dateStart).toISOString())
      );
    }

    // Fetch the documents with filters
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_STOREKWIL_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_WAITLIST,
      queryFilters
    );

    return response.documents;
  } catch (error) {
    console.error("ERROR in fetchAllWaitlistUsers", error);
    return [];
  }
}

export async function fetchApikey() {
  try {
    const { users } = await createAdminClient();
    const user = await auth.getUser();
    // const prefs = await users.getPrefs(user.$id);
    // const {
    //   dbId,
    //   Users,
    //   userPoints,
    //   tiers,
    //   rewards,
    //   transactions,
    //   queries,
    //   leads,
    //   campaigns,
    // } = prefs;
    // const apiKey = `${process.env.NEXT_PUBLIC_PROJECT_ID}${dbId}${Users}${userPoints}${tiers}${rewards}${transactions}${queries}${leads}${campaigns}`;
    return user.$id;
  } catch (error) {
    console.log("error gettubg user pref");
  }
}

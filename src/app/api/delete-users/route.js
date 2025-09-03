import { createAdminClient } from "@/lib/server/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { withAuth } from "@/lib/withAuth";
export const runtime = "nodejs"; // ensure Node runtime
function assertNotProd() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Disabled in production");
  }
}

export const POST = withAuth(async () => {
  const { users } = await createAdminClient();

  try {
    assertNotProd();

    let page = 0;
    const limit = 100;

    // Paginate through all users and delete (DEV ONLY!)
    // Consider filtering to test users in real life.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const result = await users.list([Query.limit(limit), Query.offset(page * limit)]);
      if (result.users.length === 0) break;

      for (const u of result.users) {
        // Avoid logging PII in production; this route is dev-only anyway
        // console.log(`Deleting user: ${u.$id} : ${u.name}`);
        await users.delete(u.$id);
      }

      if (result.users.length < limit) break;
      page++;
    }

    return NextResponse.json({ success: true, message: "All users deleted." });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed" },
      { status: 500 }
    );
  }
}, { roles: ["admin"] });

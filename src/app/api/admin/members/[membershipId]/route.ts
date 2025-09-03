// app/api/admin/members/[membershipId]/route.ts
import { NextResponse } from "next/server";
import { cookies as nextCookies } from "next/headers";
import { createAdminClient } from "@/appwrite/config";

const TENANTS_DB = process.env.NEXT_PUBLIC_Tenants_DATABASE_ID!;
const TENANTS_COL = process.env.NEXT_PUBLIC_Tenants_COLLECTION_ID!;

export async function DELETE(req: Request, ctx: { params: { membershipId?: string } }) {
  console.log("=== MEMBER DELETE API DEBUG ===");
  try {
    const membershipId = ctx.params?.membershipId || null;

    // 1) Try to read teamId from query
    const url = new URL(req.url);
    let teamId = url.searchParams.get("teamId");

    // 2) Fallback: try JSON body { teamId: "..." }
    if (!teamId) {
      try {
        const body = await req.json();
        teamId = body?.teamId || undefined;
      } catch {
        // ignore if no body
      }
    }

    // 3) Final fallback: try active-tenant cookie -> lookup in Tenants collection
    if (!teamId) {
      const cookieStore = nextCookies();
      const activeSlug = cookieStore.get("active-tenant")?.value;
      if (activeSlug) {
        const { databases } = createAdminClient();
        const { Query } = await import("node-appwrite");
        const tenants = await databases.listDocuments(
          TENANTS_DB,
          TENANTS_COL,
          [Query.equal("slug", activeSlug)]
        );
        const tenantDoc = tenants.documents?.[0];
        teamId = tenantDoc?.teamId;
      }
    }

    console.log("membershipId:", membershipId, "teamId:", teamId ?? null);

    if (!membershipId) {
      return NextResponse.json({ error: "Missing required parameter: membershipId" }, { status: 400 });
    }
    if (!teamId) {
      return NextResponse.json(
        { error: "Missing required parameter: teamId. Pass ?teamId=... or in body { teamId }, or ensure active-tenant cookie is set." },
        { status: 400 }
      );
    }

    const { teams } = createAdminClient();
    await teams.deleteMembership(teamId, membershipId);

    console.log("✅ Deleted membership", { teamId, membershipId });
    return NextResponse.json({ success: true, message: "Member removed successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("❌ [members/delete] error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to remove member" },
      { status: error?.code && Number.isInteger(error.code) ? error.code : 500 }
    );
  } finally {
    console.log("=== END MEMBER DELETE API DEBUG ===");
  }
}

// app/api/admin/members/list/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/appwrite/config";

const TENANTS_DB  = process.env.NEXT_PUBLIC_Tenants_DATABASE_ID!;
const TENANTS_COL = process.env.NEXT_PUBLIC_Tenants_COLLECTION_ID!;

export const runtime = "nodejs";

function readCookie(req: Request, name: string) {
  const header = req.headers.get("cookie") || "";
  const m = header.match(new RegExp(`${name}=([^;]+)`));
  return m?.[1] ?? null;
}

export async function POST(req: Request) {
  try {
    const activeSlug = readCookie(req, "active-tenant");
    if (!activeSlug) return NextResponse.json({ error: "No active tenant" }, { status: 400 });

    const { teams, databases } = createAdminClient();
    const { Query } = await import("node-appwrite");

    const body = await req.json().catch(() => ({}));
    const limit  = Math.min(Number(body?.limit ?? 25), 100);
    const offset = Math.max(Number(body?.offset ?? 0), 0);

    // Resolve teamId from slug
    const t = await databases.listDocuments(
      TENANTS_DB,
      TENANTS_COL,
      [Query.equal("slug", activeSlug)]
    );
    const tenant = t.documents[0];
    if (!tenant?.teamId) return NextResponse.json({ error: "Tenant not linked" }, { status: 404 });

    // List memberships for this team
    const res = await teams.listMemberships(tenant.teamId, [
      Query.limit(limit),
      Query.offset(offset),
    ]);

    const rows = res.memberships.map((m: any) => ({
      membershipId: m.$id,
      userId: m.userId ?? m.user?.$id,
      name: m.userName ?? m.user?.name,
      email: m.userEmail ?? m.user?.email ?? m.email, // pending invites may not have user object
      roles: m.roles || [],
      joined: m.joined,
      $createdAt: m.$createdAt,
      confirmed: m.confirm === true,
    }));

    return NextResponse.json({
      total: res.total,
      limit,
      offset,
      rows,
      teamId: tenant.teamId,
      slug: activeSlug,
    });
  } catch (e: any) {
    console.error("[members/list] error:", e?.message || e);
    return NextResponse.json({ error: "Failed to list members" }, { status: 500 });
  }
}

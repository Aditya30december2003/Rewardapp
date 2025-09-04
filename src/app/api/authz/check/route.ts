// app/api/authz/check/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";

const TENANTS_DB  = process.env.TENANTS_DATABASE_ID!;
const TENANTS_COL = process.env.TENANTS_COLLECTION_ID!;

function readCookie(req: Request, name: string) {
  const m = (req.headers.get("cookie") || "").match(new RegExp(`${name}=([^;]+)`));
  return m?.[1] ?? null;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    if (!slug) return NextResponse.json({ roles: [] }, { status: 400 });

    // 1) Get current user from session JWT
    const jwt = readCookie(req, "session");
    if (!jwt) return NextResponse.json({ roles: [] }, { status: 401 });
    const { account } = createSessionClient(jwt);
    const me = await account.get().catch(() => null);
    if (!me) return NextResponse.json({ roles: [] }, { status: 401 });

    // 2) Resolve slug -> teamId
    const { databases, teams } = createAdminClient();
    const { Query } = await import("node-appwrite");

    const docs = await databases.listDocuments(TENANTS_DB, TENANTS_COL, [
      Query.equal("slug", slug),
      Query.limit(1),
    ]);

    if (docs.total === 0) {
      return NextResponse.json({ roles: [] }, { status: 200 });
    }
    const teamId = docs.documents[0].teamId as string;

    // 3) Get this user's membership in that team
    const mships = await teams.listMemberships(teamId);
    const mine = mships.memberships.find((m) => m.userId === me.$id);

    return NextResponse.json({ roles: mine?.roles ?? [], teamId }, { status: 200 });
  } catch (e: any) {
    console.error("[authz/check] error:", e?.message || e);
    return NextResponse.json({ roles: [] }, { status: 500 });
  }
}
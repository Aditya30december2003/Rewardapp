// app/api/auth/next-destination/route.ts
import { NextResponse } from "next/server";
import { createSessionClient, createAdminClient } from "@/lib/server/appwrite";

const TENANTS_DB = process.env.NEXT_PUBLIC_Tenants_DATABASE_ID!;
const TENANTS_COL = process.env.NEXT_PUBLIC_Tenants_COLLECTION_ID!;

export const runtime = "nodejs"; // ensure Node runtime

function readCookie(req: Request, name: string) {
  const header = req.headers.get("cookie") || "";
  const m = header.match(new RegExp(`${name}=([^;]+)`));
  return m?.[1] ?? null;
}

export async function POST(req: Request) {
  try {
    const jwt = readCookie(req, "session");
    if (!jwt) {
      return NextResponse.json({ path: "/login", reason: "no-jwt" }, { status: 401 });
    }

    const { account } = createSessionClient(jwt);
    const me = await account.get();

    if (!me.emailVerification) {
      return NextResponse.json({ path: "/verify" });
    }

    const { users, databases } = createAdminClient();
    const { Query } = await import("node-appwrite");

    // 1) Get all memberships for this user
    const membershipsResp = await users.listMemberships(me.$id);
    const memberships = membershipsResp.memberships || [];
    if (!memberships.length) {
      return NextResponse.json({ path: "/choose-workspace" });
    }

    // 2) Resolve target tenant (prefer the active-tenant cookie if present)
    const activeSlug = readCookie(req, "active-tenant");

    let tenantDoc: any | null = null;
    if (activeSlug) {
      const tBySlug = await databases.listDocuments(
        TENANTS_DB,
        TENANTS_COL,
        [Query.equal("slug", activeSlug)]
      );
      tenantDoc = tBySlug.documents[0] ?? null;
      // If cookie slug is stale or unknown, fall back below
    }

    // 3) If no tenant from cookie, pick one from memberships and fetch its tenant doc
    let teamId: string | null = null;
    if (tenantDoc) {
      teamId = tenantDoc.teamId;
    } else {
      // choose first membership that has a tenant link
      for (const m of memberships) {
        const mid =
          (m as any).teamId ||
          (m as any).team?.$id ||
          (m as any).$teamId ||
          (m as any).team?.teamId;

        if (!mid) continue;

        const tResp = await databases.listDocuments(
          TENANTS_DB,
          TENANTS_COL,
          [Query.equal("teamId", mid)]
        );
        if (tResp.total > 0) {
          tenantDoc = tResp.documents[0];
          teamId = mid;
          break;
        }
      }
    }

    if (!tenantDoc || !teamId) {
      // Team exists but not linked in your Tenants collection yet
      return NextResponse.json({ path: "/choose-workspace" });
    }

    const slug: string = tenantDoc.slug;

    // 4) Find the membership for *this* team and compute role bucket
    const current = memberships.find((m) => {
      const mid =
        (m as any).teamId ||
        (m as any).team?.$id ||
        (m as any).$teamId ||
        (m as any).team?.teamId;
      return mid === teamId;
    });

    const roles: string[] = Array.isArray((current as any)?.roles)
      ? (current as any).roles.map((r: string) => r.toLowerCase())
      : [];

    const isAdmin = roles.includes("owner") || roles.includes("admin");
    const path = isAdmin ? `/t/${slug}/admin/overview` : `/t/${slug}/user/overview`;

    return NextResponse.json({ path });
  } catch (error) {
    console.error("[next-destination] error:", error);
    return NextResponse.json({ path: "/choose-workspace" }, { status: 200 });
  }
}

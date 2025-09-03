// app/api/auth/invite/confirm/route.ts
import { NextResponse } from "next/server";
import { createSessionClient, createAdminClient } from "@/appwrite/config";

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
    const jwt = readCookie(req, "session");
    if (!jwt) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await req.json().catch(() => ({}));
    const membershipId = String(payload?.membershipId || "");
    const userId       = String(payload?.userId || "");
    const secret       = String(payload?.secret || "");
    const teamIdArg    = payload?.teamId ? String(payload.teamId) : null;

    if (!membershipId || !userId || !secret) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const { account, teams } = createSessionClient(jwt);
    const me = await account.get();
    if (me.$id !== userId) {
      return NextResponse.json({ error: "Signed-in user differs from invitee" }, { status: 403 });
    }

    // Resolve teamId if it's not in the URL
    let teamId = teamIdArg;
    if (!teamId) {
      const { users } = createAdminClient();
      const ms = await users.listMemberships(me.$id);
      const found = ms.memberships.find((m: any) => m.$id === membershipId);
      teamId =
        (found as any)?.teamId ||
        (found as any)?.team?.$id ||
        (found as any)?.$teamId ||
        null;
    }

    if (!teamId) {
      return NextResponse.json({ error: "Unable to resolve teamId" }, { status: 400 });
    }

    // Confirm via session client
    await teams.updateMembershipStatus(teamId, membershipId, userId, secret);

    // Find tenant slug for this team and set cookie
    const { databases } = createAdminClient();
    const { Query } = await import("node-appwrite");
    const t = await databases.listDocuments(
      TENANTS_DB,
      TENANTS_COL,
      [Query.equal("teamId", teamId)]
    );
    const slug = t.documents?.[0]?.slug || "";

    const res = NextResponse.json({
      ok: true,
      path: slug ? `/t/${slug}/user/overview` : "/choose-workspace",
    });
    if (slug) {
      res.cookies.set("active-tenant", slug, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: (process.env.NEXT_PUBLIC_DOMAIN || "").startsWith("https"),
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return res;
  } catch (e: any) {
    if (e?.code === 409) {
      return NextResponse.json({ ok: true, path: "/choose-workspace" });
    }
    console.error("[invite/confirm] error:", e?.message || e);
    return NextResponse.json({ error: "Failed to confirm invite" }, { status: 500 });
  }
}

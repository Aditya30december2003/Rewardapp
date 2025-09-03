// app/api/admin/members/invite/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/server/appwrite";

const TENANTS_DB  = process.env.NEXT_PUBLIC_Tenants_DATABASE_ID!;
const TENANTS_COL = process.env.NEXT_PUBLIC_Tenants_COLLECTION_ID!;
const DOMAIN      = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
const INVITE_URL  = `${DOMAIN}/auth/invite/callback`;

export const runtime = "nodejs";

function readCookie(req: Request, name: string) {
  const header = req.headers.get("cookie") || "";
  const m = header.match(new RegExp(`${name}=([^;]+)`));
  return m?.[1] ?? null;
}
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export async function POST(req: Request) {
  try {
    // Resolve current tenant from cookie (or pass slug/teamId in body if you prefer)
    const activeSlug = readCookie(req, "active-tenant");
    if (!activeSlug) {
      return NextResponse.json({ error: "No active tenant" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const roles: string[] = Array.isArray(body?.roles) && body.roles.length ? body.roles : ["user"];
    const name  = body?.name ? String(body.name).trim() : undefined;

    if (!validEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { databases, teams, users } = createAdminClient();
    const { Query } = await import("node-appwrite");

    // Resolve teamId from Tenants collection by slug
    const t = await databases.listDocuments(
      TENANTS_DB,
      TENANTS_COL,
      [Query.equal("slug", activeSlug)]
    );
    const tenant = t.documents[0];
    if (!tenant?.teamId) {
      return NextResponse.json({ error: "Tenant not linked" }, { status: 404 });
    }
    const teamId: string = tenant.teamId;

    // Check if email is already registered in Appwrite
    const u = await users.list([Query.equal("email", email)]);
    const isRegistered = (u.total || 0) > 0;

    if (isRegistered) {
      // Direct add (no email) — positional signature: teamId, roles, email?, userId?
      console.log("[invite] registered=true → direct add", { teamId, roles, userId: u.users[0].$id });
      const userId = u.users[0].$id;
      await teams.createMembership(
        teamId,
        roles,
        undefined,     // email
        userId         // userId ⇒ direct add
      );
      return NextResponse.json({ ok: true, registered: true, added: true });
    }

    // Not registered → Appwrite will email the invitation with secret
    await teams.createMembership(
      teamId,
      roles,
      email,          // invitee email
      undefined,      // userId
      undefined,      // phone
      INVITE_URL,     // must be whitelisted in Appwrite Auth → Redirect URLs
      name
    );

    return NextResponse.json({ ok: true, registered: false, emailed: true });
  } catch (e: any) {
    // 409: already invited/member — treat idempotently
    if (e?.code === 409) {
      return NextResponse.json({ ok: true, note: "Already invited or member" });
    }
    console.error("[members/invite] error:", e?.message || e);
    return NextResponse.json({ error: "Failed to invite" }, { status: 500 });
  }
}

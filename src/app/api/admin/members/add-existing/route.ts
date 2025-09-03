// app/api/admin/members/add-existing/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/server/appwrite";

const TENANTS_DB  = process.env.TENANTS_DATABASE_ID!;
const TENANTS_COL = process.env.TENANTS_COLLECTION_ID!;

export const runtime = "nodejs";

// Read a cookie from the request (we use active-tenant)
function readCookie(req: Request, name: string) {
  const header = req.headers.get("cookie") || "";
  const m = header.match(new RegExp(`${name}=([^;]+)`));
  return m?.[1] ?? null;
}

const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export async function POST(req: Request) {
  try {
    // Identify which team to add into via tenant slug cookie
    const activeSlug = readCookie(req, "active-tenant");
    if (!activeSlug) {
      return NextResponse.json({ error: "No active tenant selected" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const roles: string[] = Array.isArray(body?.roles) && body.roles.length ? body.roles : ["user"];

    if (!validEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email" }, { status: 400 });
    }

    const { databases, users, teams } = createAdminClient();
    const { Query } = await import("node-appwrite");

    // Resolve teamId from your Tenants collection by slug
    const t = await databases.listDocuments(TENANTS_DB, TENANTS_COL, [Query.equal("slug", activeSlug)]);
    const tenant = t.documents[0];
    if (!tenant?.teamId) {
      return NextResponse.json({ error: "Tenant not linked to a team" }, { status: 404 });
    }
    const teamId: string = tenant.teamId;

    // Look up the Appwrite user by email (must be registered already)
    const found = await users.list([Query.equal("email", email)]);
    if ((found.total || 0) === 0) {
      return NextResponse.json(
        { error: "No account found for that email. Ask them to sign up first." },
        { status: 404 }
      );
    }
    const user = found.users[0];
    const userId = user.$id;

    // Isolation check: user must not belong to any other team
    const ms = await users.listMemberships(userId);
    const memberships = ms.memberships || [];

    // If already a confirmed member of any team other than this one → block
    const inAnotherTeam = memberships.some((m: any) => {
      const mTeamId =
        (m as any).teamId || (m as any).team?.$id || (m as any).$teamId;
      const confirmed = m.confirm === true;
      return confirmed && mTeamId && mTeamId !== teamId;
    });
    if (inAnotherTeam) {
      return NextResponse.json(
        { error: "This account already belongs to another workspace." },
        { status: 409 }
      );
    }

    // If already a member of this team (pending or confirmed) → conflict but friendly note
    const alreadyHere = memberships.some((m: any) => {
      const mTeamId =
        (m as any).teamId || (m as any).team?.$id || (m as any).$teamId;
      return mTeamId === teamId;
    });
    if (alreadyHere) {
      return NextResponse.json(
        { ok: true, note: "User is already a member of this workspace." },
        { status: 409 }
      );
    }

    // Direct add (no email): positional signature => teamId, roles, email?, userId?
    await teams.createMembership(
      teamId,
      roles,
      undefined, // email (skip)
      userId     // userId → immediate add
    );

    return NextResponse.json({ ok: true, added: true });
  } catch (e: any) {
    // If Appwrite signals duplication, treat as conflict
    if (e?.code === 409) {
      return NextResponse.json(
        { error: "User is already a member or conflicting membership exists." },
        { status: 409 }
      );
    }
    console.error("[add-existing] error:", e?.message || e);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}
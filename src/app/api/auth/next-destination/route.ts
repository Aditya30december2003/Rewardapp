// app/api/auth/next-destination/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSessionClient, createAdminClient } from "@/lib/server/appwrite";

const TENANTS_DB  = process.env.TENANTS_DATABASE_ID!;
const TENANTS_COL = process.env.TENANTS_COLLECTION_ID!;

function readCookie(req: Request, name: string) {
  const m = (req.headers.get("cookie") || "").match(new RegExp(`${name}=([^;]+)`));
  return m?.[1] ?? null;
}

// Normalize roles array → lowercase strings
function normRoles(v: any): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((r) => String(r || "").toLowerCase()).filter(Boolean);
}

// Extract a teamId from a membership object that could have different shapes
function getMembershipTeamId(m: any): string | null {
  return (
    m?.teamId ||
    m?.team?.$id ||
    m?.$teamId ||
    m?.team?.teamId ||
    null
  );
}

export async function POST(req: Request) {
  try {
    // 1) Current user (via session JWT)
    const jwt = readCookie(req, "session");
    if (!jwt) return NextResponse.json({ path: "/login", reason: "no-jwt" }, { status: 401 });

    const { account } = createSessionClient(jwt);
    const me = await account.get();

    if (!me?.emailVerification) {
      return NextResponse.json({ path: "/verify" }, { status: 200 });
    }

    // 2) Admin client to query memberships & tenants
    const { users, databases } = createAdminClient();
    const { Query } = await import("node-appwrite");

    // List all team memberships for this user
    // (admin endpoint; ok on server)
    const mResp = await users.listMemberships(me.$id);
    const allMemberships: any[] = Array.isArray(mResp?.memberships) ? mResp.memberships : [];

    // No teams at all → choose workspace
    if (!allMemberships.length) {
      return NextResponse.json({ path: "/choose-workspace" }, { status: 200 });
    }

    // Helper: given a teamId, resolve tenantDoc (slug) if exists
    const findTenantByTeamId = async (teamId: string) => {
      const r = await databases.listDocuments(
        TENANTS_DB,
        TENANTS_COL,
        [Query.equal("teamId", teamId), Query.limit(1)]
      );
      return r.total > 0 ? r.documents[0] : null;
    };

    // Helper: given a slug, resolve {teamId, tenantDoc}
    const findTenantBySlug = async (slug: string) => {
      const r = await databases.listDocuments(
        TENANTS_DB,
        TENANTS_COL,
        [Query.equal("slug", slug), Query.limit(1)]
      );
      if (r.total === 0) return { teamId: null as string | null, tenantDoc: null as any };
      const tenantDoc = r.documents[0];
      const teamId = String(tenantDoc.teamId || "");
      return { teamId, tenantDoc };
    };

    // 3) If there's an active-tenant cookie, use it only if the user is a member of that team
    let chosen: { teamId: string | null; tenantDoc: any | null } = { teamId: null, tenantDoc: null };

    const rawCookieSlug = readCookie(req, "active-tenant");
    const cookieSlug = rawCookieSlug ? decodeURIComponent(rawCookieSlug) : null;

    if (cookieSlug) {
      const tmp = await findTenantBySlug(cookieSlug);
      if (tmp.teamId) {
        const member = allMemberships.find((m) => getMembershipTeamId(m) === tmp.teamId);
        if (member) {
          chosen = tmp; // cookie accepted because membership confirmed
        }
      }
    }

    // 4) If no valid cookie target, pick best membership:
    //    - Prefer owner/admin if present
    if (!chosen.teamId) {
      // Partition memberships by role priority
      const withRoles = allMemberships.map((m) => ({
        m,
        roles: normRoles(m?.roles),
        teamId: getMembershipTeamId(m),
      })).filter((x) => x.teamId);

      const adminish = withRoles.find((x) => x.roles.includes("owner") || x.roles.includes("admin"));
      const candidate = adminish || withRoles[0];

      if (candidate?.teamId) {
        const tenantDoc = await findTenantByTeamId(candidate.teamId);
        if (tenantDoc) {
          chosen = { teamId: candidate.teamId, tenantDoc };
        }
      }
    }

    // 5) If still nothing resolvable, fallback to choose-workspace
    if (!chosen.teamId || !chosen.tenantDoc) {
      return NextResponse.json({ path: "/choose-workspace" }, { status: 200 });
    }

    const slug = String(chosen.tenantDoc.slug || "");
    const teamId = String(chosen.teamId);

    // 6) Compute current roles for this team only
    const myMembership = allMemberships.find((m) => getMembershipTeamId(m) === teamId);
    const roles = normRoles(myMembership?.roles);
    const isAdmin = roles.includes("owner") || roles.includes("admin");

    const path = isAdmin ? `/t/${slug}/admin/overview` : `/t/${slug}/user/overview`;
    return NextResponse.json({ path }, { status: 200 });
  } catch (error) {
    console.error("[next-destination] error:", error);
    // In doubt, do not reveal tenant—send chooser
    return NextResponse.json({ path: "/choose-workspace" }, { status: 200 });
  }
}
// app/api/tenancy/create-team/route.ts
import { NextResponse } from "next/server";
import { createSessionClient, createAdminClient } from "@/appwrite/config";

// If you don't use Permission/Role, feel free to remove the next line.
// import { Permission, Role } from "node-appwrite";

const TENANTS_DB = process.env.NEXT_PUBLIC_Tenants_DATABASE_ID!;
const TENANTS_COL = process.env.NEXT_PUBLIC_Tenants_COLLECTION_ID!;
const APP_URL = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
const INVITE_CALLBACK_URL = `${APP_URL}/auth/invite/callback`;

/* --------------------- utils --------------------- */
function readCookie(req: Request, name: string) {
  const header = req.headers.get("cookie") || "";
  const m = header.match(new RegExp(`${name}=([^;]+)`));
  return m?.[1] ?? null;
}

function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeName(s: string) {
  // collapse internal whitespace & lowercase for case-insensitive comparisons
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function getValidEmail(user: any): string | null {
  console.log("User object for email extraction:", JSON.stringify(user, null, 2));

  const possibleEmails = [
    user?.email,
    user?.emailAddress,
    user?.emails?.[0],
    user?.prefs?.email,
    user?.targets?.[0]?.identifier, // sometimes email is stored here
  ];

  for (const email of possibleEmails) {
    if (
      email &&
      typeof email === "string" &&
      email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      console.log("Found valid email:", email.trim());
      return email.trim();
    }
  }

  console.error("No valid email found in user object");
  return null;
}

/* --------------------- handler --------------------- */
export async function POST(req: Request) {
  try {
    // --- auth via session cookie ---
    const jwt = readCookie(req, "session");
    if (!jwt) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { account } = createSessionClient(jwt);
    const me = await account.get();

    if (!me.emailVerification) {
      return NextResponse.json({ error: "Email not verified" }, { status: 403 });
    }

    // --- parse input ---
    const body = await req.json().catch(() => ({}));
    const rawName = String(body?.name || "").trim();
    if (!rawName) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 });
    }

    const normalizedName = normalizeName(rawName);
    const baseSlug = toSlug(rawName) || `team-${Date.now()}`;

    // --- admin clients ---
    const { teams, databases } = createAdminClient();
    const { ID, Query } = await import("node-appwrite");

    // --- HARD uniqueness by name (case-insensitive) BEFORE creating Appwrite Team ---
    const existingByName = await databases
      .listDocuments(TENANTS_DB, TENANTS_COL, [Query.equal("normalizedName", normalizedName)])
      .catch(() => ({ total: 0 }));

    if ((existingByName?.total ?? 0) > 0) {
      return NextResponse.json(
        { error: "A team with this name already exists. Please choose a different name." },
        { status: 409 }
      );
    }

    // --- ensure slug uniqueness ---
    let finalSlug = baseSlug;
    for (let i = 2; i < 8; i++) {
      const exists = await databases
        .listDocuments(TENANTS_DB, TENANTS_COL, [Query.equal("slug", finalSlug)])
        .then((r) => r.total > 0)
        .catch(() => false);
      if (!exists) break;
      finalSlug = `${baseSlug}-${i}`;
    }

    // --- create Appwrite Team ---
    const team = await teams.create(ID.unique(), rawName);

    // --- create tenant document (store normalizedName) ---
    const tenantDoc = await databases.createDocument(TENANTS_DB, TENANTS_COL, ID.unique(), {
      teamId: team.$id,
      slug: finalSlug,
      name: rawName,
      normalizedName, // <— for future fast, consistent checks
      ownerUserId: me.$id,
    });

    // --- invite creator as OWNER ---
    const validatedEmail = getValidEmail(me);
    if (!validatedEmail) {
      // rollback created resources if no valid email
      await databases.deleteDocument(TENANTS_DB, TENANTS_COL, tenantDoc.$id).catch(() => {});
      await teams.delete(team.$id).catch(() => {});
      return NextResponse.json(
        { error: "No valid email address found for user account" },
        { status: 400 }
      );
    }

    // node-appwrite server SDK signature:
    // createMembership(teamId, roles, email?, userId?, phone?, url?, name?)
    try {
      await teams.createMembership(
        team.$id, // teamId
        ["owner"], // roles
        validatedEmail, // email
        undefined, // userId
        undefined, // phone
        INVITE_CALLBACK_URL, // url
        (me as any).name || undefined // name
      );
    } catch (err: any) {
      if (err?.code === 409) {
        console.warn("Membership already exists or invite already sent. Continuing.");
      } else {
        console.error("Membership creation failed:", err?.message || err);
        // rollback to avoid orphans
        await databases.deleteDocument(TENANTS_DB, TENANTS_COL, tenantDoc.$id).catch(() => {});
        await teams.delete(team.$id).catch(() => {});
        return NextResponse.json(
          { error: "Failed to create team membership" },
          { status: 500 }
        );
      }
    }

    // --- response + UX cookie for routing ---
    const res = NextResponse.json({
      ok: true,
      teamId: team.$id,
      tenantId: tenantDoc.$id,
      slug: finalSlug,
      name: rawName,
      message: "Team created. Check your email to confirm ownership.",
    });

    // This cookie is for client-side routing convenience only.
    res.cookies.set("active-tenant", finalSlug, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: APP_URL.startsWith("https"),
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (e: any) {
    console.error("[create-team] error:", e?.message || e);
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}

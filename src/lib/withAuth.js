// src/lib/withAuth.js
import { NextResponse } from "next/server";
import auth from "@/lib/auth";

/**
 * Wraps a route handler with auth + optional role checks.
 * Usage:
 *   export const POST = withAuth(async (req, ctx) => { ... }, { roles: ["admin"] })
 */
export function withAuth(handler, { roles = [] } = {}) {
  return async (req, ctx = {}) => {
    let user = null;
    try { user = await auth.getUser(); } catch {}
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.mfa === "verify") {
      return NextResponse.json({ error: "MFA required", redirect: user.message }, { status: 401 });
    }
    if (user.mfa === "error") {
      return NextResponse.json({ error: "MFA error" }, { status: 401 });
    }

    // derive role from labels (adjust if you store role elsewhere)
    const labels = Array.isArray(user.labels) ? user.labels : [];
    const role = labels.find(Boolean) || "user";

    if (roles.length && !roles.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    ctx.user = user;
    return handler(req, ctx);
  };
}

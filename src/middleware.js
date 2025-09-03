import { NextResponse } from "next/server";
import auth from "./lib/auth"; // your helper that reads the JWT cookie and gets user

// match tenant routes
const tenantAdmin = /^\/t\/([^/]+)\/admin/;
const tenantUser = /^\/t\/([^/]+)\/user/;

export async function middleware(request) {
  const { pathname } = new URL(request.url);

  // --- skip static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // --- API: skip here, your existing logic covers APIs fine
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // --- Pages: must be authenticated
  let user = null;
  try {
    user = await auth.getUser(); // should use session JWT
  } catch {}
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!user.emailVerification) {
    return NextResponse.redirect(new URL("/verify", request.url));
  }

  // --- Admin routes (/t/:slug/admin/…)
  const mAdmin = pathname.match(tenantAdmin);
  if (mAdmin) {
    const slug = mAdmin[1];
    const roles = await auth.getRolesForTenant(user.$id, slug); // helper: map slug→teamId→roles
    if (!roles.includes("owner") && !roles.includes("admin")) {
      return NextResponse.redirect(new URL(`/t/${slug}/user/overview`, request.url));
    }
  }

  // --- User routes (/t/:slug/user/…)
  const mUser = pathname.match(tenantUser);
  if (mUser) {
    const slug = mUser[1];
    const roles = await auth.getRolesForTenant(user.$id, slug);
    if (!roles.length) {
      // not in this team at all
      return NextResponse.redirect(new URL("/choose-workspace", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/t/:slug/admin/:path*",
    "/t/:slug/user/:path*",
    "/choose-workspace",
  ],
};

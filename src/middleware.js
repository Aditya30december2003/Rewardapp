// src/middleware.js
import { NextResponse } from "next/server";
import auth from "./lib/auth";

// Exact public API paths (rare)
const PUBLIC_API_PATHS = new Set([
  "/api/health",
  "/api/stripe/webhook",
  "/api/session/set",
  "/api/session/clear",
  "/api/debug/whoami",
]);

// Public API **prefixes** (covers dynamic routes)
const PUBLIC_API_PREFIXES = [
  "/api/stripe",                 // e.g. /api/stripe/webhook
  "/api/perktify/register",      // e.g. /api/perktify/register/[cid]/[company]
];

function isPublicApiPath(pathname) {
  if (PUBLIC_API_PATHS.has(pathname)) return true;
  return PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p));
}

// Basic CORS helper (tighten origins in production)
function corsHeaders(req) {
  const origin = req.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip Next internals/static
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // ---- API handling ----
  if (pathname.startsWith("/api")) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
    }

    // Public API routes bypass auth
    if (isPublicApiPath(pathname)) {
      return NextResponse.next();
    }

    // Coarse auth check for API (no redirects for APIs)
    let user = null;
    try { user = await auth.getUser(); } catch {}

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "content-type": "application/json", ...corsHeaders(request) } }
      );
    }
    if (user.mfa === "verify") {
      return new NextResponse(
        JSON.stringify({ error: "MFA required", redirect: user.message }),
        { status: 401, headers: { "content-type": "application/json", ...corsHeaders(request) } }
      );
    }
    if (user.mfa === "error") {
      return new NextResponse(
        JSON.stringify({ error: "MFA error" }),
        { status: 401, headers: { "content-type": "application/json", ...corsHeaders(request) } }
      );
    }

    // Let route handlers do fine-grained RBAC
    return NextResponse.next();
  }

  // ---- Page handling (your original redirect logic) ----
  let user = null;
  try { user = await auth.getUser(); } catch {}

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (user.mfa === "verify") {
    return NextResponse.redirect(new URL(user.message, request.url));
  } else if (user.mfa === "error") {
    return NextResponse.redirect(new URL("/login/error", request.url));
  }

  const isAdmin = user.labels?.includes("admin");
  const isUser = user.labels?.includes("user");

  // Avoid heavy work like DB setup in middleware
  if (isAdmin && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/overview", request.url));
  } else if (isUser && !pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/user/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*", // ✅ expand coverage to API routes
    "/",
    "/admin/:path*",
    "/user/:path*",
  ],
};

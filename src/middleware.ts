// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

// PUBLIC routes (no auth)
const PUBLIC_PATHS: RegExp[] = [
  /^\/login(\/.*)?$/,
  /^\/register(\/.*)?$/,
  /^\/verify(\/.*)?$/,
  /^\/auth\/invite(\/.*)?$/,
  /^\/password\/reset(\/.*)?$/,
  /^\/contactSales(\/.*)?$/,
];

const tenantAdmin = /^\/t\/([^/]+)\/admin/;
const tenantUser  = /^\/t\/([^/]+)\/user/;

function isBypass(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    /\.(png|jpg|jpeg|gif|svg|webp|ico|txt|json|css|js|map)$/.test(pathname)
  );
}

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((rx) => rx.test(pathname));
}

// Edge-safe nonce
function genNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

// Appwrite origins for CSP
const APPWRITE_ORIGIN = (process.env.NEXT_PUBLIC_ENDPOINT || "").replace(/\/v1$/, "");
const APPWRITE_WS = APPWRITE_ORIGIN ? APPWRITE_ORIGIN.replace(/^https/i, "wss") : "";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 0) Bypass static & API
  if (isBypass(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 1) Auth redirect (cookie-only; no SDK in Edge)
  const session = req.cookies.get("session")?.value ?? null;

  // Always send "/" to /login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Non-public pages require a session
  if (!isPublic(pathname) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2) Tenant/role guard via Node route (no server SDK in middleware)
  const mAdmin = pathname.match(tenantAdmin);
  const mUser  = pathname.match(tenantUser);

  if (mAdmin || mUser) {
    const slug = (mAdmin?.[1] || mUser?.[1])!;
    // Call your Node API to check membership/roles (includes cookies automatically)
    const url = new URL("/api/authz/check", req.url);
    url.searchParams.set("slug", slug);

    try {
      const r = await fetch(url, {
        // Forward the session cookie so the Node route can read it
        headers: { cookie: req.headers.get("cookie") || "" },
        // Avoid caching role responses
        cache: "no-store",
      });

      // If the check fails for any reason, send to login
      if (!r.ok) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const { roles } = (await r.json()) as { roles: string[] };

      // Not a member of this tenant
      if (!roles || roles.length === 0) {
        return NextResponse.redirect(new URL("/choose-workspace", req.url));
      }

      // Admin routes require owner/admin
      if (mAdmin && !roles.some((r) => r === "owner" || r === "admin")) {
        return NextResponse.redirect(new URL(`/t/${slug}/user/overview`, req.url));
      }
    } catch (error) {
      console.error("Error checking tenant roles:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 3) CSP with nonce (your original logic)
  const res = NextResponse.next();
  const nonce = genNonce();

  const isProd = process.env.NODE_ENV === "production";
  const scriptSrc = isProd
    ? [`'self'`, `'nonce-${nonce}'`, `'strict-dynamic'`]
    : [`'self'`, `'unsafe-inline'`, `'unsafe-eval'`, "blob:"];

  const connectSrc = [
    `'self'`,
    APPWRITE_ORIGIN,
    APPWRITE_WS,
    ...(isProd ? [] : ["http://localhost:3000", "ws://localhost:3000"]),
  ].filter(Boolean);

  const csp = [
    "default-src 'self'",
    `img-src 'self' data: blob: ${APPWRITE_ORIGIN}`,
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `connect-src ${connectSrc.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.headers.set("x-nonce", nonce);

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
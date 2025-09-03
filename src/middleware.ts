// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths that do NOT require auth
const PUBLIC_PATHS: RegExp[] = [
  /^\/login(\/.*)?$/,
  /^\/register(\/.*)?$/,
  /^\/verify(\/.*)?$/,
  /^\/auth\/invite(\/.*)?$/,
  /^\/password\/reset(\/.*)?$/,
];

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

// Per-request CSP nonce (Edge Web Crypto)
function genNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin);
}


// Pull Appwrite origins (strip /v1)
const APPWRITE_ORIGIN =
  (process.env.NEXT_PUBLIC_ENDPOINT || "").replace(/\/v1$/, "");
const APPWRITE_WS = APPWRITE_ORIGIN
  ? APPWRITE_ORIGIN.replace(/^https/i, "wss")
  : "";

export function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // 0) Bypass static & API
  if (isBypass(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 1) Auth redirection (cookie-only; no server SDK here)
  const session = req.cookies.get("session")?.value ?? null;

  // Always redirect "/" to /login immediately (your requirement)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // For non-public pages, require session cookie
  if (!isPublic(pathname) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2) Nonce-based CSP
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

  // Security headers
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // Expose nonce so you can use it with <Script nonce={...}>
  res.headers.set("x-nonce", nonce);

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

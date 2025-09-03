// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// PUBLIC routes (no auth redirect)
const PUBLIC_PATHS: RegExp[] = [
  /^\/$/,                         // homepage -> we will redirect to /login below (see note)
  /^\/login(\/.*)?$/,
  /^\/register(\/.*)?$/,
  /^\/verify(\/.*)?$/,
  /^\/auth\/invite(\/.*)?$/,
  /^\/password\/reset(\/.*)?$/,
];

// Static/Next assets: always pass through
function isBypass(pathname: string) {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|txt|json)$/)
  ) return true;
  return false;
}

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((rx) => rx.test(pathname));
}

// IMPORTANT: generate a nonce per request (Edge-safe)
function genNonce() {
  // small/fast random; good enough for CSP nonce (base64url)
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

// Add/adjust these for your environment:
const APPWRITE_ORIGIN = process.env.NEXT_PUBLIC_ENDPOINT?.replace(/\/v1$/, "") || "";
const APPWRITE_WS = APPWRITE_ORIGIN.replace(/^https/i, "wss");

export function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // 0) Fast bypass
  if (isBypass(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 1) Auth redirect logic (NO server SDK calls here!)
  const session = req.cookies.get("session")?.value ?? null;

  // If homepage "/", redirect to /login immediately (your requirement)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // For non-public pages, require session cookie
  if (!isPublic(pathname) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2) Build a CSP with a per-request nonce
  const res = NextResponse.next();
  const nonce = genNonce();

  const isProd = process.env.NODE_ENV === "production";

  // In dev we keep inline/eval permissive for HMR; in prod use nonce+strict-dynamic
  const scriptSrc = isProd
    ? [`'self'`, `'nonce-${nonce}'`, `'strict-dynamic'`]
    : [`'self'`, `'unsafe-inline'`, `'unsafe-eval'`, "blob:"];

  const connectSrc = [
    `'self'`,
    APPWRITE_ORIGIN,
    APPWRITE_WS,
    // dev websockets for Next HMR:
    ...(isProd ? [] : ["http://localhost:3000", "ws://localhost:3000"]),
  ].filter(Boolean);

  const csp = [
    "default-src 'self'",
    // If you serve images from Appwrite Storage, allow that origin:
    `img-src 'self' data: blob: ${APPWRITE_ORIGIN}`,
    `script-src ${scriptSrc.join(" ")}`,
    // If you don't use inline styles, you can drop 'unsafe-inline' here
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

  // Expose the nonce so your layout can use it on any inline <Script> you add
  res.headers.set("x-nonce", nonce);

  return res;
}

// Apply to everything except Next assets; APIs are already handled inside
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

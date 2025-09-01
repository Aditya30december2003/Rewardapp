/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

// ✅ Your Appwrite host (no /v1)
const APPWRITE_ORIGIN = "https://hostsuite.teamhup.com";
const APPWRITE_WS = "wss://hostsuite.teamhup.com";

// Your site domains (add dev + prod)
const SITE_ORIGINS = [
  "http://localhost:3000",
  "http://rewardapp.hivefinty.com",
];

const scriptSrc = isProd
  ? ["'self'"]
  : ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"];

const connectSrc = isProd
  ? ["'self'", APPWRITE_ORIGIN, APPWRITE_WS]
  : ["'self'", APPWRITE_ORIGIN, APPWRITE_WS, "http://localhost:3000", "ws://localhost:3000"];


const csp =
  [
    "default-src 'self'",
    // if you show Appwrite Storage images, allow that host here too
    `img-src 'self' data: blob: ${APPWRITE_ORIGIN}`,
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `connect-src ${connectSrc.join(" ")}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ") + ";";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  experimental: {
    serverActions: {
      // include your dev+prod sites
      allowedOrigins: ["localhost:3000", "rewardapp.hivefinty.com"],
    },
  },
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;

// src/lib/cors.js
const ALLOWED = new Set([
  "https://app.perktify.com",
  "https://rewards.storekwil.com",
  // "http://localhost:3000", // <- uncomment for local dev if needed
  // add other allowed origins here
]);

export function corsHeaders(req) {
  const origin = req.headers.get("origin") || "";
  const headers = {
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (ALLOWED.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

export function preflight(req) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

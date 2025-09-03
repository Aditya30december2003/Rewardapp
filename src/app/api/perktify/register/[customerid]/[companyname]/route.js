import { createNewUserRegistration } from "@/lib/actions";
import { NextResponse } from "next/server";
import { corsHeaders, preflight } from "@/lib/cors";
import { rateLimit } from "@/lib/rateLimit"; // add this file if you haven't yet (see below)
// export const runtime = "nodejs"; // ensure Node runtime

export function OPTIONS(req) {
  // Allow browser preflight if this is called from another allowed origin
  return preflight(req);
}

function getTrimmed(formData, key) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function isEmail(x) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
}

function isPhone(x) {
  // relaxed: digits, spaces, +, -, ()
  return /^[0-9+\-()\s]{7,20}$/.test(x);
}

export async function POST(req, { params }) {
  const headers = corsHeaders(req); // respond with CORS headers if needed
  const { customerid, companyname } = params || {};

  // 1) Basic path param checks
  if (!customerid || !companyname) {
    return NextResponse.json(
      { message: "Missing customer/company params", type: "error" },
      { status: 400, headers }
    );
  }

  // 2) Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, retryAfter } = rateLimit(`register:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { message: "Too Many Requests", type: "error" },
      { status: 429, headers: { ...headers, "Retry-After": String(retryAfter) } }
    );
  }

  try {
    // 3) Read & validate fields from form data
    const formData = await req.formData();

    const firstName = getTrimmed(formData, "firstName");
    const lastName  = getTrimmed(formData, "lastName");
    const email     = getTrimmed(formData, "email");
    const company   = getTrimmed(formData, "company");
    const country   = getTrimmed(formData, "country");
    const phone     = getTrimmed(formData, "phone");
    const referCode = getTrimmed(formData, "referCode"); // optional

    if (!firstName) return NextResponse.json({ message: "invalid firstName field or missing", type: "error" }, { status: 400, headers });
    if (!lastName)  return NextResponse.json({ message: "invalid lastName field or missing",  type: "error" }, { status: 400, headers });
    if (!email || !isEmail(email)) return NextResponse.json({ message: "invalid email field or missing", type: "error" }, { status: 400, headers });
    if (!company)   return NextResponse.json({ message: "invalid company field or missing",  type: "error" }, { status: 400, headers });
    if (!country)   return NextResponse.json({ message: "invalid country field or missing",  type: "error" }, { status: 400, headers });
    if (!phone || !isPhone(phone)) return NextResponse.json({ message: "invalid phone field or missing", type: "error" }, { status: 400, headers });

    // Normalize: set admin/company fields from path (don’t trust body)
    formData.set("adminId", customerid);
    formData.set("company", companyname);

    // Treat empty referCode as absent
    if (!referCode) formData.delete("referCode");

    // 4) Call your action
    const result = await createNewUserRegistration(null, formData);

    const status = result?.type === "success" ? 200 : 400;
    return NextResponse.json(
      { message: result?.message ?? "unknown result", type: result?.type ?? "error" },
      { status, headers }
    );
  } catch (error) {
    console.error("Error in Registration api ", error);
    return NextResponse.json(
      { message: "internal server Error", type: "error" },
      { status: 500, headers }
    );
  }
}

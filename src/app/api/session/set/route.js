// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// // Set an HttpOnly cookie "session" holding the Appwrite JWT.
// // We keep this route tiny and let your server actions read it later.
// export async function POST(req) {
//   try {
//     const { jwt, remember } = await req.json();

//     if (!jwt || typeof jwt !== "string") {
//       return NextResponse.json({ error: "Missing jwt" }, { status: 400 });
//     }

//     // Cookie options
//     const isProd = process.env.NODE_ENV === "production";
//     const maxAge = remember ? 60 * 60 * 24 * 30 : undefined; // 30d, else session cookie

//     cookies().set({
//       name: "session",
//       value: jwt,
//       httpOnly: true,
//       sameSite: "strict",
//       secure: isProd,
//       path: "/",
//       maxAge,
//     });

//     return new NextResponse(null, { status: 204 });
//   } catch (e) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
// }
// app/api/session/set/route.ts
// app/api/session/set/route.ts
import { NextResponse } from "next/server";

export async function POST(req) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "true";

  try {
    const { jwt, remember } = await req.json().catch(() => ({}));
    if (debug) {
      console.log("[SET SESSION] body:", {
        hasJwt: Boolean(jwt),
        remember: Boolean(remember),
      });
    }

    if (!jwt || typeof jwt !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid jwt" },
        { status: 400 }
      );
    }
    // quick sanity: a JWT should be dot separated
    if (jwt.split(".").length !== 3) {
      return NextResponse.json(
        { ok: false, error: "Malformed jwt" },
        { status: 400 }
      );
    }

    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true });

    const maxAge = remember ? 60 * 60 * 24 * 30 : undefined; // 30d
    res.cookies.set("session", jwt, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      ...(maxAge ? { maxAge } : {}),
    });

    if (debug) {
      console.log("[SET SESSION] cookie set (HttpOnly). maxAge:", maxAge || "session");
    }
    return res;
  } catch (e) {
    console.error("[SET SESSION] ERROR:", e?.message || e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Internal error" },
      { status: 500 }
    );
  }
}

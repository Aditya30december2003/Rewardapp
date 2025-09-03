// app/api/debug/whoami/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionClient } from "@/lib/server/appwrite";
export const runtime = "nodejs"; // ensure Node runtime
export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "true";

  try {
    const jwt = cookies().get("session")?.value;
    if (debug) {
      console.log("[WHOAMI] hasCookie:", Boolean(jwt), jwt ? jwt.slice(0, 16) + "…" : "");
    }
    if (!jwt) {
      return NextResponse.json({ ok: false, error: "No session cookie" }, { status: 401 });
    }

    const { account } = createSessionClient(jwt);
    const me = await account.get();

    if (debug) console.log("[WHOAMI] account.get OK:", { $id: me.$id, email: me.email, labels: me.labels });
    return NextResponse.json({ ok: true, user: { id: me.$id, email: me.email, labels: me.labels } });
  } catch (e: any) {
    console.error("[WHOAMI] ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: e?.message || "whoami failed" }, { status: 401 });
  }
}

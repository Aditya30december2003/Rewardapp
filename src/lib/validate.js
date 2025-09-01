// src/lib/validate.js
import { NextResponse } from "next/server";

export async function parseJson(req, schema) {
  let body = null;
  try { body = await req.json(); } catch { /* noop */ }

  const result = schema.safeParse(body);
  if (!result.success) {
    return { ok: false, res: NextResponse.json({ error: "Invalid payload" }, { status: 400 }) };
  }
  return { ok: true, data: result.data };
}

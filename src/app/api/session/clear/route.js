import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const isProd = process.env.NODE_ENV === "production";
  cookies().set({
    name: "session",
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: isProd,
    path: "/",
    maxAge: 0,
  });
  return new NextResponse(null, { status: 204 });
}

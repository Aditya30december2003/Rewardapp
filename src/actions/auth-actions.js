"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/server/appwrite";

export async function deleteSession() {
  const session = cookies().get("session");

  if (session?.value) {
    try {
      const { account } = await createSessionClient(session.value);
      await account.deleteSession("current");
    } catch {
      // ignore errors; we'll still clear cookie + redirect
    }
  }

  // Clear/expire the cookie
  cookies().set({
    name: "session",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  redirect("/login");
}

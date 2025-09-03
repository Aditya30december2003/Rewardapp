"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWebClient } from "@/lib/client/appwrite";

export default function VerifyPage() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("We’ve sent a verification link to your email.");
  const [err, setErr] = useState("");

  async function resend() {
    setSending(true);
    setErr("");
    try {
      const { account } = createWebClient();
      await account.createVerification(`${process.env.NEXT_PUBLIC_DOMAIN}/verify/callback`);
      setMsg("Verification email re-sent. Please check your inbox.");
    } catch (e) {
      setErr(e?.message || "Failed to resend verification.");
    } finally {
      setSending(false);
    }
  }

  async function continueAfterVerified() {
    // Ask the server where to go (it already checks verification + teams)
    const dest = await fetch("/api/auth/next-destination", { method: "POST" }).then(r => r.json());
    router.replace(dest?.path || "/choose-workspace");
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold mb-2">Verify your email</h1>
      <p className="text-gray-600 mb-4">{msg}</p>
      {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
      <div className="flex gap-3">
        <button
          onClick={resend}
          className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
          disabled={sending}
        >
          {sending ? "Sending…" : "Resend email"}
        </button>
        <button
          onClick={continueAfterVerified}
          className="rounded border px-4 py-2"
        >
          I’ve verified — Continue
        </button>
      </div>
    </main>
  );
}

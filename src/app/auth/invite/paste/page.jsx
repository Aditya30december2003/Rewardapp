// app/auth/invite/paste/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasteInvitePage() {
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    try {
      const u = new URL(url);
      const membershipId = u.searchParams.get("membershipId");
      const userId       = u.searchParams.get("userId");
      const secret       = u.searchParams.get("secret");
      const teamId       = u.searchParams.get("teamId");
      if (!membershipId || !userId || !secret) throw new Error("Invalid invite link");

      const params = new URLSearchParams({
        membershipId, userId, secret, ...(teamId ? { teamId } : {})
      });
      router.replace(`/auth/invite/callback?${params.toString()}`);
    } catch (e) {
      setErr(e?.message || "Invalid URL");
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Join a team</h1>
      <p className="mt-2 text-sm text-gray-600">
        Paste the full invite link you received by email to join a team.
      </p>

      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="url"
          className="w-full rounded-md border px-3 py-2"
          placeholder="https://your-app.com/auth/invite/callback?membershipId=...&userId=...&secret=..."
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-white">
          Continue
        </button>
      </form>
    </main>
  );
}

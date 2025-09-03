// app/auth/invite/callback/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function InviteCallbackPage() {
  const [msg, setMsg] = useState("Confirming your invitation…");

  useEffect(() => {
    (async () => {
      const url = new URL(window.location.href);
      const membershipId = url.searchParams.get("membershipId") || "";
      const userId       = url.searchParams.get("userId") || "";
      const secret       = url.searchParams.get("secret") || "";
      const teamId       = url.searchParams.get("teamId") || "";

      if (!membershipId || !userId || !secret) {
        setMsg("Invalid invitation link.");
        return;
      }

      const r = await fetch("/api/auth/invite/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId, userId, secret, teamId }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) {
        // If not authenticated yet, ask them to login then revisit this link
        setMsg(j?.error || "Failed to confirm. Make sure you are signed in with the invited account.");
        return;
      }

      setMsg("Invitation confirmed! Redirecting…");
      setTimeout(() => {
        window.location.replace(j.path || "/choose-workspace");
      }, 800);
    })().catch((e) => setMsg(e?.message || "Unexpected error."));
  }, []);

  return (
    <div className="mx-auto mt-24 max-w-md rounded-lg border border-gray-800 bg-gray-900 p-6 text-gray-200">
      <h1 className="mb-2 text-lg font-semibold">Team Invitation</h1>
      <p>{msg}</p>
    </div>
  );
}

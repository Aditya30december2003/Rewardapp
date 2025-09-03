"use client";

import { useEffect, useState } from "react";

export default function InviteCallbackPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Confirming invite…");

  useEffect(() => {
    const url = new URL(window.location.href);
    const membershipId = url.searchParams.get("membershipId") || "";
    const userId       = url.searchParams.get("userId") || "";
    const secret       = url.searchParams.get("secret") || "";
    const teamId       = url.searchParams.get("teamId") || ""; // not always present

    if (!membershipId || !userId || !secret) {
      setStatus("error");
      setMessage("Missing invitation parameters.");
      return;
    }

    (async () => {
      try {
        const r = await fetch("/api/auth/invite/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ membershipId, userId, secret, teamId }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j?.ok) {
          throw new Error(j?.error || "Failed to confirm invitation");
        }
        setStatus("ok");
        setMessage("Invitation confirmed! Redirecting…");
        // Redirect to the right tenant/role destination (server returns a path)
        const to = j?.path || "/choose-workspace";
        setTimeout(() => {
          window.location.replace(to);
        }, 1200);
      } catch (err) {
        setStatus("error");
        setMessage(err?.message || "Failed to confirm invitation.");
      }
    })();
  }, []);

  return (
    <div className="mx-auto mt-24 max-w-md rounded-lg border border-gray-800 bg-gray-900 p-6 text-gray-200">
      <h1 className="mb-2 text-lg font-semibold">Team Invitation</h1>
      <p className={status === "error" ? "text-red-400" : "text-gray-300"}>{message}</p>
      {status === "error" && (
        <p className="mt-2 text-sm text-gray-400">
          Make sure you are signed in with the same email that received the invite, then reload this page.
        </p>
      )}
    </div>
  );
}

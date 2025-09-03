"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTeamPage() {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  // (client) CreateTeamPage component — onSubmit error handling
  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    setMsg("");

    try {
      const res = await fetch("/api/tenancy/create-team", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("That team name is taken. Try a different name.");
        }
        throw new Error(data?.error || "Failed to create team");
      }

      setMsg(`Team "${data?.name}" created. We've sent an ownership confirmation to your email.`);
      setRedirecting(true);

      const dest = await fetch("/api/auth/next-destination", { method: "POST" })
        .then((r) => r.json())
        .catch(() => ({ path: "/choose-workspace" }));

      setTimeout(() => router.replace(dest?.path || "/choose-workspace"), 600);
    } catch (e) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Create a new team</h1>
      <p className="mt-2 text-sm text-gray-600">
        You will be the owner and can invite teammates after creation.
      </p>

      {msg && <div className="mt-4 rounded-md bg-green-50 p-3 text-green-700">{msg}</div>}
      {err && <div className="mt-4 rounded-md bg-red-50 p-3 text-red-700">{err}</div>}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Team name</span>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Acme Dental"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create team"}
        </button>
      </form>
      
      {redirecting && (
        <div className="mt-8 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
          Please wait while we redirect you to your workspace.
        </div>
      )}
    </main>
  );
}

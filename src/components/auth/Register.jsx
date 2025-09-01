"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createWebClient } from "@/appwrite/web";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { BiSolidError } from "react-icons/bi";

export default function RegisterForm({
  presetEmail = "",
  presetName = "",
  invite = null, // { adminId, companyName } or null
  redirectTo = "/admin/overview", // change later if you fan-out by role
}) {
  const router = useRouter();
  const qs = useSearchParams();

  const [name, setName] = useState(presetName);
  const [email, setEmail] = useState(presetEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const { account } = createWebClient();

      // 1) Create auth account (browser)
      await account.create("unique()", email, password, name);

      // 2) Create session
      await account.createEmailPasswordSession(email, password);

      // 3) Mint JWT
      const { jwt } = await account.createJWT();

      // 4) Store JWT as HttpOnly cookie (same cookie name used by auth.js)
      const r = await fetch("/api/session/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jwt, remember }),
      });
      if (!r.ok) throw new Error("Failed to persist session");

      // (Optional) Attach invite info to localStorage for a later onboarding step
      if (invite?.adminId && invite?.companyName) {
        localStorage.setItem(
          "perktify_invite",
          JSON.stringify({ adminId: invite.adminId, companyName: invite.companyName })
        );
      }

      // 5) Redirect to your onboarding/overview
      router.replace(redirectTo);
    } catch (err) {
      setError(err?.message || "Registration failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
      {error && (
        <div className="mb-2 flex items-start rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <BiSolidError className="mr-2 mt-0.5 h-5 w-5" /> {error}
        </div>
      )}

      <Input
        label="Full name"
        name="name"
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ada Lovelace"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        Keep me signed in
      </label>

      <Button
        type="submit"
        disabled={submitting}
        className={[
          "mt-2 w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white",
          "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          submitting ? "opacity-90 cursor-not-allowed" : "",
        ].join(" ")}
      >
        {submitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}

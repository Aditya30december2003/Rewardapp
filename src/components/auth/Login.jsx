"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Input from "../common/Input";
import Button from "../common/Button";
import { BiSolidError } from "react-icons/bi";
import { createWebClient } from "@/appwrite/web";
 
function safeErr(e) {
  if (!e) return "Unknown error";
  if (typeof e === "string") return e;
  return e.message || e.code || JSON.stringify(e);
}

export default function Login({ className = "" }) {
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") === "true";      // turn on with ?debug=true
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const log = (...a) => debug && console.log("%c[LOGIN]", "color:#6b21a8", ...a);
  const warn = (...a) => debug && console.warn("[LOGIN]", ...a);
  const err = (...a) => debug && console.error("[LOGIN]", ...a);

  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      setEmail("demo@storekwil.com");
      setPassword("Demo@1234");
    }
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    log("Submit start", { email });

    try {
      const remember =
        e.currentTarget.querySelector("#remember-me")?.checked || false;
      const { account } = createWebClient();

      // 0) Try to remove any old browser session
      try {
        log("Attempting account.deleteSession('current') …");
        await account.deleteSession("current");
        log("deleteSession('current') success (or no session).");
      } catch (delErr) {
        warn("deleteSession('current') error (often safe to ignore):", safeErr(delErr));
      }

      // 1) Create browser session
      log("Creating email+password session …");
      await account.createEmailPasswordSession(email, password);
      log("createEmailPasswordSession OK.");

      // 2) Mint JWT to use on server
      log("Requesting account.createJWT() …");
      const jwtResp = await account.createJWT();
      log("JWT received:", jwtResp?.jwt ? `${jwtResp.jwt.slice(0, 16)}…` : "(none)");

      if (!jwtResp?.jwt) throw new Error("No JWT returned by Appwrite");

      // 3) Send JWT to server to set HttpOnly cookie
      log("POST /api/session/set …");
      const r = await fetch("/api/session/set?debug=" + String(debug), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jwt: jwtResp.jwt, remember }),
      });
      const body = await r.json().catch(() => ({}));
      log("POST /api/session/set status:", r.status, "body:", body);
      if (!r.ok) throw new Error(body?.error || "Failed to set session");

      // 4) Sanity check the cookie via server (optional, but great for debugging)
      log("GET /api/debug/whoami …");
      const who = await fetch("/api/debug/whoami?debug=" + String(debug)).then(res => res.json());
      log("whoami:", who);
      if (!who?.ok) throw new Error("Server cannot read JWT cookie (whoami failed): " + (who?.error || "unknown"));

      // 5) Redirect
      log("All good. Redirecting to /admin/workspace");
      
      // old: router.replace("/admin/overview");
const dest = await fetch("/api/auth/next-destination", { method: "POST" })
  .then(r => r.json());
router.replace(dest?.path || "/choose-workspace");

setTimeout(() => {
  window.location.href = dest?.path || "/choose-workspace";
}, 1000);
 

    } catch (e) {
      err("Login failed:", e);
      setError(safeErr(e));
      setSubmitting(false);
    }
  }

  // UI (unchanged except error + onSubmit)
  return (
    <div className={["relative mx-auto w-full max-w-md px-4 sm:px-0", className].join(" ")}>
      {error && (
        <div className="mb-6 flex items-start rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <BiSolidError className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>

          <div className="text-sm">
            <Link href="/password/reset" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </Link>
          </div>
        </div>

        <div>
          <Button type="submit" disabled={submitting} className="btn-sheen flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700">
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </form>

      {/* Tip: add ?debug=true to the URL to see logs in console */}
      {debug && (
        <p className="mt-4 text-xs text-gray-500">
          Debug logging is <b>ON</b>. Open console to view step-by-step logs.
        </p>
      )}
    </div>
  );
}


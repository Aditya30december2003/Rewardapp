// src/app/verify/callback/page.jsx
"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserSDK } from "@/lib/client/appwrite";

// If you want to fully avoid pre-rendering for this page (helpful for auth flows):
export const dynamic = "force-dynamic";

function VerifyCallbackInner() {
  const router = useRouter();
  const qp = useSearchParams();
  const [status, setStatus] = useState("working");
  const [message, setMessage] = useState("Verifying your email…");
  const ran = useRef(false);

  const userId = useMemo(() => qp.get("userId"), [qp]);
  const secret = useMemo(() => qp.get("secret"), [qp]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!userId || !secret) {
      setStatus("err");
      setMessage("Invalid verification link.");
      return;
    }

    (async () => {
      try {
        const { account } = getBrowserSDK();
        await account.updateVerification(userId, secret);

        setStatus("ok");
        setMessage("Email verified! Redirecting…");

        const dest = await fetch("/api/auth/next-destination", { method: "POST" })
          .then((r) => r.json())
          .catch(() => ({ path: "/choose-workspace" }));

        router.replace(dest?.path || "/choose-workspace");
      } catch (e) {
        setStatus("err");
        setMessage(e?.message || "Verification failed. The link may have expired.");
      }
    })();
  }, [router, userId, secret]);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold mb-2">Email Verification</h1>
      <p className={status === "err" ? "text-red-600" : "text-gray-700"}>{message}</p>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-6">Loading…</div>}>
      <VerifyCallbackInner />
    </Suspense>
  );
}

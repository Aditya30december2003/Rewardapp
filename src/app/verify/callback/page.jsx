"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createWebClient } from "@/appwrite/web";

export default function VerifyCallbackPage() {
  const router = useRouter();
  const qp = useSearchParams();
  const [status, setStatus] = useState("working");
  const [message, setMessage] = useState("Verifying your email…");

  useEffect(() => {
    const userId = qp.get("userId");
    const secret = qp.get("secret");
    if (!userId || !secret) {
      setStatus("err");
      setMessage("Invalid verification link.");
      return;
    }

    (async () => {
      try {
        const { account } = createWebClient();
        // Confirms the verification using the link params
        await account.updateVerification(userId, secret);

        setStatus("ok");
        setMessage("Email verified! Redirecting…");

        // Ask server where to go (role + team aware)
        const dest = await fetch("/api/auth/next-destination", { method: "POST" })
          .then(r => r.json());
        router.replace(dest?.path || "/choose-workspace");
      } catch (e) {
        setStatus("err");
        setMessage(e?.message || "Verification failed. The link may have expired.");
      }
    })();
  }, [qp, router]);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold mb-2">Email Verification</h1>
      <p className={status === "err" ? "text-red-600" : "text-gray-700"}>{message}</p>
    </main>
  );
}

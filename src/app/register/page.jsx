"use client";

import Link from "next/link";
import RegisterForm from "@/components/auth/Register";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-[url('/bg.webp')] bg-cover bg-center">
      <div className="absolute inset-0">
        <div className="h-full w-full rounded-bl-[50px] bg-gradient-to-b from-indigo-600 to-emerald-500/90 opacity-80" />
      </div>

      <header className="relative z-10 flex items-center justify-center md:justify-start p-6 px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <img src="/logowhite.png" alt="Perktify" className="h-12" />
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-6 pb-12 md:grid-cols-2 md:pt-2">
        {/* Left: copy or illustration */}
        <div className="hidden md:flex items-center">
          <div className="rounded-2xl bg-white/20 p-6 text-white backdrop-blur-md shadow-xl">
            <h2 className="text-3xl font-bold">Create your Perktify account</h2>
            <p className="mt-2 opacity-90">
              Access rewards dashboards, admin tools, and real-time analytics.
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-1 opacity-90">
              <li>Secure SSO & MFA-ready</li>
              <li>Team & tenant isolation with Appwrite</li>
              <li>Fast onboarding</li>
            </ul>
          </div>
        </div>

        {/* Right: form card */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-white/20 bg-white/85 p-6 shadow-xl backdrop-blur-md">
            <h3 className="mb-1 text-2xl font-semibold text-gray-900">Sign up</h3>
            <p className="mb-4 text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-600 hover:underline">Sign in</Link>
            </p>

            <RegisterForm redirectTo="/admin/overview" />
          </div>
        </div>
      </section>
    </main>
  );
}

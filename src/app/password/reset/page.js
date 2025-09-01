"use client"
import Image from "next/image";
import Link from "next/link";
import RecoveryForm from "@/components/user/password/RecoveryForm";

export default function PasswordResetPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[300px] w-[800px] rounded-full bg-gradient-to-tr from-cyan-300 to-blue-500 opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white/60 shadow-2xl backdrop-blur-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column Illustration */}
            <div className="hidden md:flex items-center justify-center bg-blue-50 rounded-lg p-6">
              <Image src="/pas.png" alt="Reset password" width={300} height={300} />
            </div>

            {/* Right Column Form */}
            <div className="flex flex-col justify-center">
              <Link href="/" className="mb-6 inline-block">
                <Image src="/darklogo.png" alt="Logo" width={100} height={70} />
              </Link>

              <h1 className="mb-4 text-3xl font-bold text-slate-800">Forgot Your Password? OR Want to update it?</h1>
              <p className="mb-6 text-slate-600">
                No worries! Enter your email and we’ll send you a link to reset your password.
              </p>

              {/* 👉 Client Form */}
              <RecoveryForm />

              <div className="mt-6 text-center">
                <Link href="/login" className="text-blue-600 hover:underline">&larr; Back to Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

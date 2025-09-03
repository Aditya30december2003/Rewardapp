// app/choose-workspace/page.tsx
import Link from "next/link";

export default function ChooseWorkspacePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Choose your workspace</h1>
      <p className="mt-2 text-sm text-gray-600">
        You’re not in a team yet. Create a new one, or join an existing team with an invite link.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {/* Create new team */}
        <Link
          href="/create-team"
          className="group rounded-xl border p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="text-lg font-semibold">Create a new team</div>
          <p className="mt-1 text-sm text-gray-600">
            Spin up a fresh workspace. You’ll be the owner and can invite others.
          </p>
          <span className="mt-4 inline-flex items-center text-indigo-600 text-sm group-hover:underline">
            Continue →
          </span>
        </Link>

        {/* Join existing team */}
        <Link
          href="/user/overview"
          className="group rounded-xl border p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="text-lg font-semibold">Dont want a membership</div>
          
          <span className="mt-4 inline-flex items-center text-indigo-600 text-sm group-hover:underline">
            Continue →
          </span>
        </Link>
      </div>

      <div className="mt-8 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
        Tip: If you expect to be in a team here, ask your admin and he will add you in the team.
        <Link href="/create-team" className="text-indigo-600 underline">
          or create one now
        </Link>.
      </div>
    </main>
  );
}

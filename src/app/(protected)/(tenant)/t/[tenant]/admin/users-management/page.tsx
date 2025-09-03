"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

type Filters = {
  query?: string;
  queryType?: string;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
};

type Member = {
  membershipId: string;
  name?: string;
  email?: string;
  roles?: string[];
  joined?: string;
  $createdAt?: string;
  confirmed?: boolean;
};

export default function FilteredUsersTable({ filters = {} }: { filters?: Filters }) {
  const [data, setData] = useState<{ rows: Member[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Add UI state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"user" | "admin">("user");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const limit = filters?.limit ?? 25;
  const offset = filters?.offset ?? 0;

  async function loadMembers() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/admin/members/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit, offset }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed to load");
      setData({ rows: j.rows, total: j.total });
    } catch (e: any) {
      setErr(e?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (ignore) return;
      await loadMembers();
    })();
    return () => {
      ignore = true;
    };
  }, [limit, offset]);

  const filtered = useMemo(() => {
    if (!data?.rows) return [];
    const q = (filters?.query ?? "").trim().toLowerCase();
    if (!q) return data.rows;
    return data.rows.filter((r) => {
      const n = (r.name || "").toLowerCase();
      const e = (r.email || "").toLowerCase();
      return n.includes(q) || e.includes(q);
    });
  }, [data, filters?.query]);

  async function removeMembership(membershipId: string) {
    if (!confirm("Remove this member from the workspace?")) return;
    setBusy(membershipId);
    setErr(null);
    try {
      const r = await fetch(`/api/admin/members/${membershipId}`, { method: "DELETE" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error || "Failed to remove");
      setData((prev) =>
        prev ? { ...prev, rows: prev.rows.filter((x) => x.membershipId !== membershipId) } : prev
      );
    } catch (e: any) {
      setErr(e?.message || "Remove failed");
    } finally {
      setBusy(null);
    }
  }

  function resetInviteForm() {
    setInviteEmail("");
    setInviteName("");
    setInviteRole("user");
    setInviteError(null);
    setInviteSuccess(null);
  }

  // ✅ Add registered-only, with isolation messages
  async function submitInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteSubmitting(true);
    setInviteError(null);
    setInviteSuccess(null);
    try {
      const email = inviteEmail.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      const r = await fetch("/api/admin/members/add-existing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          roles: [inviteRole], // server enforces who can add admins
          name: inviteName.trim() || undefined, // optional, server may ignore
        }),
      });

      const j = await r.json().catch(() => ({}));

      if (!r.ok) {
        // map the most important cases to crisp messages
        if (r.status === 404) {
          // not registered
          throw new Error(j?.error || "No account found for that email. Ask them to sign up first.");
        }
        if (r.status === 409) {
          // conflict — either already a member here or belongs to another team
          // Prefer server to send specific error codes/messages; fall back to generic:
          const msg =
            j?.error ||
            j?.note ||
            "This account already belongs to another workspace (or is already a member).";
          throw new Error(msg);
        }
        // other errors
        throw new Error(j?.error || "Failed to add user");
      }

      // 200 OK path
      if (j.added) {
        setInviteSuccess(`Added ${email} to the team.`);
      } else if (j.note === "User is already a member" || j.note) {
        setInviteSuccess(j.note);
      } else {
        setInviteSuccess("User processed.");
      }

      await loadMembers();

      setTimeout(() => {
        setInviteOpen(false);
        resetInviteForm();
      }, 800);
    } catch (e: any) {
      setInviteError(e?.message || "Add failed");
    } finally {
      setInviteSubmitting(false);
    }
  }

  if (loading) return <div className="rounded-md bg-gray-800 p-4 text-gray-300">Loading members…</div>;
  if (err) return <div className="rounded-md bg-red-50 p-3 text-red-700">{err}</div>;

  return (
    <div className="space-y-3">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Team Members</h2>
        <button
          onClick={() => setInviteOpen(true)}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Member
        </button>
      </div>

      {inviteSuccess && (
        <div className="rounded-md border border-emerald-800 bg-emerald-900/40 px-3 py-2 text-sm text-emerald-200">
          {inviteSuccess}
        </div>
      )}

      <div className="text-white font-semibold">
        Add only those members who are registered with this website
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900/60">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Roles</Th>
              <Th>Joined</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {filtered.map((m) => (
              <tr key={m.membershipId} className="hover:bg-gray-800/60">
                <Td>
                  <div className="flex items-center gap-2">
                    <span>{m.name || "—"}</span>
                    {m.confirmed === false && (
                      <span className="rounded bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
                        Pending
                      </span>
                    )}
                  </div>
                </Td>
                <Td className="font-mono text-sm">{m.email || "—"}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {(m.roles || []).map((r: string) => (
                      <span key={r} className="rounded bg-gray-700 px-2 py-0.5 text-xs uppercase tracking-wide">
                        {r}
                      </span>
                    ))}
                    {!m.roles?.length && <span className="text-gray-400">—</span>}
                  </div>
                </Td>
                <Td className="text-sm text-gray-400">
                  {new Date(m.joined || m.$createdAt || Date.now()).toLocaleString()}
                </Td>
                <Td className="text-right">
                  <button
                    disabled={busy === m.membershipId}
                    onClick={() => removeMembership(m.membershipId)}
                    className={clsx(
                      "rounded-md border px-3 py-1 text-sm transition",
                      busy === m.membershipId
                        ? "cursor-wait border-gray-600 text-gray-400"
                        : "border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    )}
                  >
                    {busy === m.membershipId ? "Removing…" : "Remove"}
                  </button>
                </Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <Td colSpan={5} className="py-10 text-center text-gray-400">
                  No members match your filters.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add modal (registered-only) */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-100">Add Member (registered only)</h3>
              <button
                onClick={() => {
                  setInviteOpen(false);
                  resetInviteForm();
                }}
                className="rounded px-2 py-1 text-sm text-gray-300 hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitInvite} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300">Email *</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 outline-none focus:border-indigo-500"
                  placeholder="teammate@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "user" | "admin")}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 outline-none focus:border-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Only registered accounts can be added. Users can belong to one workspace only.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Name (optional)</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 outline-none focus:border-indigo-500"
                  placeholder="Teammate name"
                />
              </div>

              {inviteError && (
                <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">{inviteError}</div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setInviteOpen(false);
                    resetInviteForm();
                  }}
                  className="rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteSubmitting}
                  className={clsx(
                    "rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700",
                    inviteSubmitting && "cursor-wait opacity-70"
                  )}
                >
                  {inviteSubmitting ? "Adding…" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={clsx("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400", className)}>
      {children}
    </th>
  );
}

function Td({ children, className = "", colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={clsx("px-4 py-3 align-middle text-gray-200", className)}>
      {children}
    </td>
  );
}
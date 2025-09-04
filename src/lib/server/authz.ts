// src/lib/server/authz.ts
import "server-only";
import { createAdminClient } from "@/lib/server/appwrite";

export async function getRolesForTenant(userId: string, slug: string) {
  const { databases, teams } = createAdminClient();
  const TENANTS_DB = process.env.TENANTS_DATABASE_ID!;
  const TENANTS_COL = process.env.TENANTS_COLLECTION_ID!;
  const { Query } = await import("node-appwrite");

  // 1) Resolve slug -> teamId
  const res = await databases.listDocuments(TENANTS_DB, TENANTS_COL, [
    Query.equal("slug", slug),
    Query.limit(1),
  ]);
  if (res.total === 0) return { roles: [], teamId: null }; // slug not found

  const teamId = res.documents[0].teamId as string;

  // 2) Strict membership lookup for this user in this team
  // (Use admin client so this can run in middleware)
  const memberships = await teams.listMemberships(teamId);
  const mine = memberships.memberships.find(m => m.userId === userId);
  if (!mine) return { roles: [], teamId };

  // 3) Normalize roles
  const roles = Array.isArray(mine.roles) ? mine.roles : [];
  return { roles, teamId };
}

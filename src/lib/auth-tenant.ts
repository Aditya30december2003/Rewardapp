import { createAdminClient } from "@/lib/server/appwrite";

const TENANTS_DB = process.env.TENANTS_DATABASE_ID!;
const TENANTS_COL = process.env.TENANTS_COLLECTION_ID!;

/**
 * Get the roles a user has within a tenant, by slug.
 * @param userId Appwrite user $id
 * @param slug   Tenant slug (e.g., "acme-dental")
 * @returns      Array of role strings, e.g. ["owner"], ["admin"], ["member"]
 */
export async function getRolesForTenant(userId: string, slug: string): Promise<string[]> {
  const { databases, users } = createAdminClient();
  const { Query } = await import("node-appwrite");

  // 1) find tenant by slug
  const tenantsResp = await databases.listDocuments(
    TENANTS_DB,
    TENANTS_COL,
    [Query.equal("slug", slug)]
  );
  const tenant = tenantsResp.documents[0];
  if (!tenant) return [];

  // 2) list memberships for this user
  const membershipsResp = await users.listMemberships(userId);
  const memberships = membershipsResp.memberships || [];

  // 3) find membership for this tenant's teamId
  const m = memberships.find((m: any) => {
    return (
      m.teamId === tenant.teamId ||
      m.team?.$id === tenant.teamId ||
      m.$teamId === tenant.teamId
    );
  });

  return m?.roles || [];
}

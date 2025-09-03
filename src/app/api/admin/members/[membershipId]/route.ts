// app/api/admin/members/[membershipId]/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/appwrite/config";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: { membershipId: string } }
) {
  try {
    const { membershipId } = params;
    if (!membershipId) {
      return NextResponse.json({ error: "No membershipId" }, { status: 400 });
    }

    const { teams } = createAdminClient();

    // First, get the membership to find out which team it belongs to
    const membership = await teams.getMembership(membershipId);
    
    // Extract the teamId from the membership
    const teamId = membership.teamId || membership.$teamId || membership.team?.$id;
    
    if (!teamId) {
      return NextResponse.json({ error: "Could not determine teamId" }, { status: 400 });
    }

    // Now delete the membership with both required parameters
    await teams.deleteMembership(teamId, membershipId);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[members/delete] error:", e?.message || e);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
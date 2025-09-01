import { createAdminClient } from "@/appwrite/config";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { z } from "zod";

const Schema = z.object({
  bodyColor: z.string().min(1),
  accentColor: z.string().min(1),
  dbId: z.string().min(1),
});

export const POST = withAuth(async (req) => {
  let data;
  try { data = await req.json(); } catch {}
  const parsed = Schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { bodyColor, accentColor, dbId } = parsed.data;

  try {
    const { databases } = await createAdminClient();
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_SUBSCRIPTION_DATABASE_ID,
      process.env.NEXT_PUBLIC_SUBSCRIBERS_COLLECTION_ID,
      dbId,
      { bodyColor, accentColor }
    );

    return NextResponse.json(
      { message: "Colors updated successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "failed to update color", details: error?.message },
      { status: 500 }
    );
  }
}, { roles: ["admin", "manager"] });

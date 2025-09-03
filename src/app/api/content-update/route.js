import { createAdminClient } from "@/lib/server/appwrite";
import { NextResponse } from "next/server";
export const runtime = "nodejs"; // ensure Node runtime
export async function POST(req) {
  try {
    const { heading, title, dbId } = await req.json();
    const { databases } = await createAdminClient();

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_SUBSCRIPTION_DATABASE_ID,
      process.env.NEXT_PUBLIC_SUBSCRIBERS_COLLECTION_ID,
      dbId,
      { heading, title }
    );

    return NextResponse.json(
      { message: "Content Updated successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to update Content ${error}` },
      { status: 500 }
    );
  }
}

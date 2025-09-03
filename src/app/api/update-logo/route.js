import { createAdminClient } from "@/lib/server/appwrite";
import { NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { withAuth } from "@/lib/withAuth";
export const runtime = "nodejs"; // ensure Node runtime

const MAX = 2 * 1024 * 1024; // 2MB
const OK = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);

export const POST = withAuth(async (req) => {
  let type = "";
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const dbId = formData.get("dbId");
    type = String(formData.get("type") || "");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Invalid file uploaded" }, { status: 400 });
    }
    if (!dbId) {
      return NextResponse.json({ message: "Missing dbId" }, { status: 400 });
    }
    if (!type) {
      return NextResponse.json({ message: "Missing type" }, { status: 400 });
    }
    if (!OK.has(file.type) || file.size > MAX) {
      return NextResponse.json({ message: "Invalid file type/size" }, { status: 400 });
    }

    const { storage, databases } = await createAdminClient();

    // Upload file
    const uploaded = await storage.createFile(
      process.env.NEXT_PUBLIC_LOGOS_STORAGE_ID,
      ID.unique(),
      file
    );
    const imageId = uploaded.$id;

    // Only permit specific fields to be updated
    const updateData = {};
    if (type === "logoId") {
      updateData.logoId = imageId;
    } else if (type === "backgroundImageId") {
      updateData.backgroundImageId = imageId;
    } else {
      return NextResponse.json(
        { message: "Invalid image type specified", success: false },
        { status: 400 }
      );
    }

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_SUBSCRIPTION_DATABASE_ID,
      process.env.NEXT_PUBLIC_SUBSCRIBERS_COLLECTION_ID,
      dbId,
      updateData
    );

    return NextResponse.json(
      { message: `${type} Updated successfully`, success: true },
      { status: 200 }
    );
  } catch (error) {
    // Avoid referencing `type` if it was never set in a failed parse
    return NextResponse.json(
      { message: `Failed to update image`, error: String(error) },
      { status: 500 }
    );
  }
}, { roles: ["admin"] });

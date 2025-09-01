import { fetchAllUsers } from "@/lib/data";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req) => {
  try {
    const documents = await fetchAllUsers();
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}, { roles: ["admin"] });

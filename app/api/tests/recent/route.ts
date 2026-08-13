import { NextResponse } from "next/server";
import { getRecentTests } from "@/app/utils/actions";
import getSessionUser from "@/lib/auth";

export async function GET() {
  try {
    // Verify the user is authenticated via server session
    const user = await getSessionUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Use the session user ID — not a client-provided query param
    const tests = await getRecentTests(user.id);
    return NextResponse.json({ tests });
  } catch (error) {
    console.error("Error fetching recent tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent tests" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getTestStatus } from "@/app/utils/actions";
import getSessionUser from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify the user is authenticated via server session
    const user = await getSessionUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Invalid test ID" }, { status: 400 });
    }

    const test = await getTestStatus(id);

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error("Error fetching test status:", error);
    return NextResponse.json(
      { error: "Failed to fetch test status" },
      { status: 500 }
    );
  }
}

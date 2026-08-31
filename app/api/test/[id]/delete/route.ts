import { NextResponse } from "next/server";
import { deleteTest } from "@/app/utils/actions";
import getSessionUser from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: testId } = await params;
    if (!testId) {
      return NextResponse.json({ error: "Missing test ID" }, { status: 400 });
    }

    const result = await deleteTest(testId);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to delete test" },
        { status: result.error?.includes("Forbidden") ? 403 : 400 }
      );
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error("Error in delete test API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

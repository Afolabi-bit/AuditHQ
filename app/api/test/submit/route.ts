import { submitDomain } from "@/app/utils/actions";
import { NextResponse } from "next/server";
import getSessionUser from "@/lib/auth";
import { executeAuditForTest } from "@/lib/pagespeed-runner";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for full Lighthouse cloud execution

export async function POST(request: Request) {
  try {
    // Verify the user is authenticated via server session
    const user = await getSessionUser();
    if (!user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const data = {
      url: body.url,
      device: body.device,
      network: body.network,
      userID: user.id,
    };

    // 1. Create or retrieve domain & create test record
    const result = await submitDomain(data);

    // 2. Directly and synchronously execute the PageSpeed / Lighthouse audit
    await executeAuditForTest(
      result.testId,
      data.url,
      data.device,
      data.network
    );

    // 3. Fetch the finalized test record from DB
    const completedTest = await prisma.test.findUnique({
      where: { id: result.testId },
      select: {
        id: true,
        status: true,
        performanceScore: true,
        errorMessage: true,
      },
    });

    if (completedTest?.status === "failed") {
      return NextResponse.json(
        {
          message: completedTest.errorMessage || "Lighthouse could not audit this page.",
          data: completedTest,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        message: "Audit completed successfully",
        data: {
          testId: result.testId,
          status: completedTest?.status || "completed",
          performanceScore: completedTest?.performanceScore,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/test/submit:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { message: "This URL is already in your tracked domains." },
          { status: 409 }
        );
      }

      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

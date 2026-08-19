import { submitDomain } from "@/app/utils/actions";
import { NextResponse, after } from "next/server";
import getSessionUser from "@/lib/auth";
import { executeAuditForTest } from "@/lib/pagespeed-runner";

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

    // Override userID with the authenticated session user — never trust the client
    const data = {
      url: body.url,
      device: body.device,
      network: body.network,
      userID: user.id,
    };

    const result = await submitDomain(data);

    // Keep the serverless runtime alive until the PageSpeed audit finishes and writes to DB
    after(async () => {
      try {
        await executeAuditForTest(
          result.testId,
          data.url,
          data.device,
          data.network
        );
      } catch (err) {
        console.error(`Background audit error for test #${result.testId}:`, err);
      }
    });

    return NextResponse.json(
      {
        message: "Test queued successfully",
        data: result,
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

import { NextResponse } from "next/server";
import { runPageSpeedAudit } from "@/lib/pagespeed-runner";
import getSessionUser from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Verify the user is authenticated via server session
    const user = await getSessionUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("❌ LIGHTHOUSE API - JSON Parse Failed:", parseError);
      return NextResponse.json(
        {
          error: "INVALID REQUEST BODY",
          message: "Failed to parse JSON request body",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
        },
        { status: 400 }
      );
    }

    const { url, device, network } = body;

    // Call shared PageSpeed utility (Google Cloud Lighthouse runner)
    const results = await runPageSpeedAudit({
      url,
      device: device?.toLowerCase(),
      network,
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("❌ LIGHTHOUSE API ERROR:", error);

    return NextResponse.json(
      {
        error: "LIGHTHOUSE AUDIT FAILED",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      error: "METHOD NOT ALLOWED",
      message: "This endpoint only accepts POST requests",
      usage: {
        method: "POST",
        path: "/api/lighthouse",
        body: {
          url: "string (required) - The URL to test",
          device: "mobile | desktop (required)",
          network: "string (optional)",
        },
        example: {
          url: "https://example.com",
          device: "mobile",
          network: "4G",
        },
      },
    },
    { status: 405 }
  );
}

export const maxDuration = 60;
export const dynamic = "force-dynamic";

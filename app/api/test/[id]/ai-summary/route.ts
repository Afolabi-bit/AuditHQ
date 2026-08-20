import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getOrGenerateAiSummary } from "@/lib/ai/generate-summary";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const test = await prisma.test.findUnique({
      where: { id },
      select: {
        id: true,
        aiSummary: true,
        status: true,
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    if (test.aiSummary) {
      return NextResponse.json({ summary: test.aiSummary, cached: true });
    }

    return NextResponse.json({ summary: null, cached: false });
  } catch (error: any) {
    console.error("Error retrieving AI summary:", error);
    return NextResponse.json(
      { error: "Failed to retrieve AI summary" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const forceRefresh = body?.force === true;

    const summary = await getOrGenerateAiSummary(id, forceRefresh);

    if (!summary) {
      return NextResponse.json(
        { error: "Test report is not ready or failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ summary, cached: true });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    
    let clientMessage = "Unable to generate AI performance diagnostics at this moment.";
    if (error?.message?.includes("API key")) {
      clientMessage = "Google AI API key is missing or invalid.";
    } else if (error?.message?.includes("quota") || error?.message?.includes("rate")) {
      clientMessage = "AI rate limit reached. Please wait a moment and retry.";
    }

    return NextResponse.json(
      { error: clientMessage },
      { status: 500 }
    );
  }
}

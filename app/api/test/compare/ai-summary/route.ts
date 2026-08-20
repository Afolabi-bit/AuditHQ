import { NextRequest, NextResponse } from "next/server";
import { generateCompareAiSummary } from "@/lib/ai/compare-summary";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { baseId, targetId } = body;

    if (!baseId || !targetId) {
      return NextResponse.json(
        { error: "baseId and targetId are required" },
        { status: 400 }
      );
    }

    const summary = await generateCompareAiSummary(String(baseId), String(targetId));

    if (!summary) {
      return NextResponse.json(
        { error: "One or both audit reports could not be loaded" },
        { status: 404 }
      );
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("AI Compare Generation Error:", error);

    let clientMessage = "Unable to generate comparative AI analysis at this moment.";
    if (error?.message?.includes("API key")) {
      clientMessage = "Google AI API key is missing or invalid.";
    } else if (error?.message?.includes("quota") || error?.message?.includes("rate")) {
      clientMessage = "AI rate limit reached. Please retry in a few seconds.";
    }

    return NextResponse.json({ error: clientMessage }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { parseExamPdf } from "@/lib/import/parse-exam-pdf";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.name.toLowerCase().endsWith(".docx")) {
      return NextResponse.json(
        { error: "Please upload a .docx file." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    const rawText = result.value;

    if (!rawText || rawText.trim().length < 20) {
      return NextResponse.json(
        { error: "Could not extract text from the Word document." },
        { status: 422 }
      );
    }

    // Reuse the same parser used for PDF text
    const parsed = parseExamPdf(rawText);

    return NextResponse.json({
      success: true,
      paper: parsed,
    });
  } catch (err) {
    console.error("Word import error:", err);
    return NextResponse.json(
      { error: "Failed to parse Word document." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { parseExamPdf } from "@/lib/import/parse-exam-pdf";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.name.endsWith(".pdf")) {
      return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400 });
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Import the lib directly to avoid pdf-parse's index.js which tries to read a test file
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse/lib/pdf-parse") as (buf: Buffer) => Promise<{ text: string; numpages: number }>;
    const data = await pdfParse(buffer);

    const rawText = data.text;
    if (!rawText || rawText.trim().length < 20) {
      return NextResponse.json(
        { error: "Could not extract text from the PDF. The file may be image-based (scanned). Try a text-based PDF." },
        { status: 422 }
      );
    }

    const parsed = parseExamPdf(rawText);

    // If no questions found, the PDF is likely scanned/image-based
    if (parsed.questions.length === 0) {
      return NextResponse.json({
        success: true,
        paper: {
          subject: parsed.subject,
          gradeLevel: parsed.gradeLevel,
          year: parsed.year,
          term: parsed.term,
          examType: parsed.examType,
          school: parsed.school,
          totalMarks: parsed.totalMarks,
          timeMinutes: parsed.timeMinutes,
          paperNumber: parsed.paperNumber,
          questions: [],
        },
        rawText: rawText.substring(0, 5000),
        totalPages: data.numpages,
        warning: "No questions could be extracted. This PDF may be scanned/image-based. Only text-based PDFs are supported. You can still fill in the detected metadata manually.",
      });
    }

    return NextResponse.json({
      success: true,
      paper: {
        subject: parsed.subject,
        gradeLevel: parsed.gradeLevel,
        year: parsed.year,
        term: parsed.term,
        examType: parsed.examType,
        school: parsed.school,
        totalMarks: parsed.totalMarks,
        timeMinutes: parsed.timeMinutes,
        paperNumber: parsed.paperNumber,
        questions: parsed.questions,
      },
      rawText: parsed.rawText.substring(0, 5000), // Send truncated raw text for review
      totalPages: data.numpages,
    });
  } catch (err) {
    console.error("PDF import error:", err);
    return NextResponse.json(
      { error: "Failed to parse PDF. Please ensure the file is a valid PDF document." },
      { status: 500 }
    );
  }
}

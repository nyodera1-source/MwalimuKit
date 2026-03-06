import { anthropic } from "./anthropic-client";

// ─── Types ───

export interface GenerateNotesInput {
  grade: string;
  subject: string;
  strand: string;
  subStrand: string;
  sloDescriptions: string[];
  noteType: "lecture" | "discussion" | "revision";
  fast?: boolean; // Use faster model for browse/preview generation
}

export interface GeneratedNotes {
  introduction: string;
  keyConcepts: string;
  detailedExplanations: string;
  examples: string;
  studentActivities: string;
  assessmentQuestions: string;
  teacherTips: string;
}

// ─── Note type prompts ───

function getNoteTypeInstruction(noteType: string): string {
  switch (noteType) {
    case "discussion":
      return `You are creating a DISCUSSION GUIDE. Focus on:
- Thought-provoking questions that stimulate class discussion
- Multiple perspectives and viewpoints on the topic
- Group activity prompts and debate points
- Open-ended questions that encourage critical thinking
- Suggested discussion flow and facilitation notes`;

    case "revision":
      return `You are creating REVISION NOTES. Focus on:
- Concise summaries of key points (bullet-point style)
- Quick-reference definitions and formulas
- Common exam questions and how to approach them
- Memory aids, mnemonics, and tips
- Practice questions with brief model answers`;

    default: // "lecture"
      return `You are creating comprehensive LECTURE NOTES. Focus on:
- Thorough explanations suitable for teaching
- Step-by-step breakdowns of concepts
- Real-world connections and applications relevant to Kenyan students
- Visual descriptions (diagrams the teacher can draw on the board)
- Scaffolded content from simple to complex`;
  }
}

// ─── Main generation function ───

export async function generateTeachingNotes(
  input: GenerateNotesInput
): Promise<GeneratedNotes> {
  const { grade, subject, strand, subStrand, sloDescriptions, noteType } = input;

  const sloList = sloDescriptions
    .map((d, i) => `  ${i + 1}. ${d}`)
    .join("\n");

  const systemPrompt = `You are an expert Kenyan CBC (Competency-Based Curriculum) teacher content creator.
You create detailed, accurate teaching notes aligned to the Kenya CBC framework.

${getNoteTypeInstruction(noteType)}

IMPORTANT RULES:
- Content must be appropriate for ${grade} level
- Use natural, locally-relevant examples without being overly specific about companies/organizations
- Align strictly to the provided Specific Learning Outcomes (SLOs)
- Use clear, teacher-friendly language
- Include enough detail that a teacher can teach directly from these notes
- For Mathematics/Science: include worked examples with step-by-step solutions
- For Languages: include vocabulary, sentence structures, and communication activities
- For Humanities: include key facts, dates, and analytical frameworks
- Examples should feel natural and authentic, not obviously AI-generated
- Avoid phrases like "Kenya-specific" or "Kenyan examples" - just use them naturally

FORMATTING RULES:
- DO NOT use Markdown syntax (no **, *, #, etc.)
- Use CAPITALIZATION for emphasis instead of bold (e.g., "IMPORTANT NOTE:")
- Use numbered lists: 1. 2. 3. or lettered lists: a) b) c)
- Use bullet points with dashes: - Point one
- Separate sections with double line breaks
- Keep formatting clean and readable as plain text

Return your response as a JSON object with these exact keys:
{
  "introduction": "...",
  "keyConcepts": "...",
  "detailedExplanations": "...",
  "examples": "...",
  "studentActivities": "...",
  "assessmentQuestions": "...",
  "teacherTips": "..."
}

Each value should be a multi-paragraph string with rich content.
Use numbered lists (1. 2. 3.), bullet points (- item), and clear formatting.
CRITICAL: Do NOT use Markdown syntax (**bold**, *italic*, etc.) - use plain text with CAPITALIZATION for emphasis.`;

  const userPrompt = `Create ${noteType} notes for:

Grade: ${grade}
Subject: ${subject}
Strand: ${strand}
Sub-Strand: ${subStrand}

Specific Learning Outcomes (SLOs):
${sloList}

Please generate comprehensive teaching notes covering all the SLOs above.`;

  const response = await anthropic.messages.create({
    model: input.fast
      ? "claude-haiku-4-5-20251001"
      : "claude-sonnet-4-5-20250929",
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract text content
  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON — handle markdown code fences and surrounding text
  let jsonStr = text.trim();

  // Remove markdown code fences (handles ```json, ```, or incomplete fences)
  jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  jsonStr = jsonStr.trim();

  // If the response has text before/after the JSON object, extract just the JSON
  const firstBrace = jsonStr.indexOf("{");
  const lastBrace = jsonStr.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
  }

  // Debug logging
  console.log("=== AI Response Debug ===");
  console.log("Raw text length:", text.length);
  console.log("First 200 chars:", text.substring(0, 200));
  console.log("After fence removal:", jsonStr.substring(0, 200));
  console.log("========================");

  // Clean any stray markdown/JSON artifacts from a section value
  function cleanSection(val: unknown): string {
    if (typeof val !== "string") return "";
    return val
      .replace(/^```(?:json)?\s*/gi, "")
      .replace(/```\s*$/g, "")
      .replace(/\\n/g, "\n")
      .trim();
  }

  try {
    const parsed = JSON.parse(jsonStr) as GeneratedNotes;
    return {
      introduction: cleanSection(parsed.introduction),
      keyConcepts: cleanSection(parsed.keyConcepts),
      detailedExplanations: cleanSection(parsed.detailedExplanations),
      examples: cleanSection(parsed.examples),
      studentActivities: cleanSection(parsed.studentActivities),
      assessmentQuestions: cleanSection(parsed.assessmentQuestions),
      teacherTips: cleanSection(parsed.teacherTips),
    };
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    console.error("Failed to parse JSON string:", jsonStr.substring(0, 500));

    // Check if truncated (unterminated string error)
    const isTruncated = parseError instanceof SyntaxError &&
                        parseError.message.includes("Unterminated string");

    if (isTruncated) {
      console.warn("Response appears truncated. Attempting to salvage...");
      // Find the last complete field by looking for the last comma or opening brace
      // Then close the unterminated string and object
      const lastComma = jsonStr.lastIndexOf('",');
      if (lastComma > 0) {
        try {
          const salvaged = jsonStr.slice(0, lastComma + 1) + "\n}";
          const parsed = JSON.parse(salvaged) as GeneratedNotes;
          console.log("Successfully salvaged truncated response");
          return {
            introduction: parsed.introduction || "",
            keyConcepts: parsed.keyConcepts || "",
            detailedExplanations: parsed.detailedExplanations || "",
            examples: parsed.examples || "",
            studentActivities: parsed.studentActivities || "",
            assessmentQuestions: parsed.assessmentQuestions || "",
            teacherTips: parsed.teacherTips || "",
          };
        } catch (salvageError) {
          console.error("Salvage attempt failed:", salvageError);
        }
      }
    }

    // Try traditional salvage method
    const lastBrace = jsonStr.lastIndexOf("}");
    if (lastBrace > 0) {
      try {
        const salvaged = JSON.parse(jsonStr.slice(0, lastBrace + 1)) as GeneratedNotes;
        return {
          introduction: salvaged.introduction || "",
          keyConcepts: salvaged.keyConcepts || "",
          detailedExplanations: salvaged.detailedExplanations || "",
          examples: salvaged.examples || "",
          studentActivities: salvaged.studentActivities || "",
          assessmentQuestions: salvaged.assessmentQuestions || "",
          teacherTips: salvaged.teacherTips || "",
        };
      } catch {
        // Fall through
      }
    }

    // All parsing failed — return a clean error message, never raw JSON
    return {
      introduction:
        "Teaching notes could not be generated properly. Please try again.",
      keyConcepts: "",
      detailedExplanations: "",
      examples: "",
      studentActivities: "",
      assessmentQuestions: "",
      teacherTips: "",
    };
  }
}

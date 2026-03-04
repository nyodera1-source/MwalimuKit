import { anthropic } from "./anthropic-client";

// ─── Types ───

export interface GenerateNotesInput {
  grade: string;
  subject: string;
  strand: string;
  subStrand: string;
  sloDescriptions: string[];
  noteType: "lecture" | "discussion" | "revision";
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
- Use Kenyan context, examples, and references where possible
- Align strictly to the provided Specific Learning Outcomes (SLOs)
- Use clear, teacher-friendly language
- Include enough detail that a teacher can teach directly from these notes
- For Mathematics/Science: include worked examples with step-by-step solutions
- For Languages: include vocabulary, sentence structures, and communication activities
- For Humanities: include key facts, dates, and analytical frameworks

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

Each value should be a multi-paragraph string with rich content. Use numbered lists, bullet points, and clear formatting within each section.`;

  const userPrompt = `Create ${noteType} notes for:

Grade: ${grade}
Subject: ${subject}
Strand: ${strand}
Sub-Strand: ${subStrand}

Specific Learning Outcomes (SLOs):
${sloList}

Please generate comprehensive teaching notes covering all the SLOs above.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract text content
  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON — handle markdown code fences
  let jsonStr = text.trim();

  // Remove markdown code fences (handles ```json, ```, or incomplete fences)
  jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  jsonStr = jsonStr.trim();

  // Debug logging
  console.log("=== AI Response Debug ===");
  console.log("Raw text length:", text.length);
  console.log("First 200 chars:", text.substring(0, 200));
  console.log("After fence removal:", jsonStr.substring(0, 200));
  console.log("========================");

  try {
    const parsed = JSON.parse(jsonStr) as GeneratedNotes;
    return {
      introduction: parsed.introduction || "",
      keyConcepts: parsed.keyConcepts || "",
      detailedExplanations: parsed.detailedExplanations || "",
      examples: parsed.examples || "",
      studentActivities: parsed.studentActivities || "",
      assessmentQuestions: parsed.assessmentQuestions || "",
      teacherTips: parsed.teacherTips || "",
    };
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    console.error("Failed to parse JSON string:", jsonStr.substring(0, 500));
    // If JSON parsing fails, try to salvage by finding last complete }
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

    // Return raw text as introduction if all parsing fails
    return {
      introduction: text,
      keyConcepts: "",
      detailedExplanations: "",
      examples: "",
      studentActivities: "",
      assessmentQuestions: "",
      teacherTips: "",
    };
  }
}

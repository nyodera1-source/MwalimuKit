import { anthropic } from "./anthropic-client";

export interface GenerateDiscussionInput {
  experimentName: string;
  subject: string;
  grade: string;
  aim: string;
  procedure: string[];
  expectedResults: string;
  relatedConcepts: string[];
  studentObservations?: string;
  studentResults?: string;
}

export interface GeneratedDiscussion {
  discussionAnswers: string;
  assessmentNotes: string;
}

export async function generateActivityDiscussion(
  input: GenerateDiscussionInput
): Promise<GeneratedDiscussion> {
  const {
    experimentName,
    subject,
    grade,
    aim,
    procedure,
    expectedResults,
    relatedConcepts,
    studentObservations,
    studentResults,
  } = input;

  const procedureText = procedure
    .map((step, i) => `  ${i + 1}. ${step.replace(/^\d+\.\s*/, "")}`)
    .join("\n");
  const conceptsList = relatedConcepts.join(", ");

  const systemPrompt = `You are an expert Kenyan CBC science teacher creating discussion guides for lab experiments.

Your task is to create TWO sections for teachers to use when discussing the experiment with learners:

1. DISCUSSION GUIDE: Detailed discussion points that:
   - Link the observations/results to the related scientific concepts
   - Explain WHY the results occurred (the science behind it)
   - Connect to real-world applications relevant to Kenyan students
   - Include 3-5 thought-provoking questions to ask learners
   - Address common misconceptions
   - Use age-appropriate language for ${grade}

2. ASSESSMENT NOTES: Brief notes on:
   - What to look for in learner responses (key concepts they should mention)
   - How to assess understanding (what indicates mastery)
   - Common errors or misconceptions to watch for
   - Differentiation tips (support for struggling learners, extension for advanced)

IMPORTANT RULES:
- Write for TEACHERS, not students
- Be specific to THIS experiment, not generic
- Use natural, professional language
- DO NOT use Markdown syntax (no **, *, #, etc.)
- Use CAPITALIZATION for emphasis
- Use numbered lists: 1. 2. 3.
- Use bullet points with dashes: - Point
- Keep it practical and classroom-ready

Return your response as a JSON object:
{
  "discussionAnswers": "...",
  "assessmentNotes": "..."
}`;

  const userPrompt = `Generate discussion guide and assessment notes for:

Experiment: ${experimentName}
Subject: ${subject}
Grade: ${grade}
Aim: ${aim}

Procedure:
${procedureText}

Expected Results:
${expectedResults}

Related Concepts: ${conceptsList}

${
  studentObservations
    ? `Student Observations (recorded):
${studentObservations}

`
    : ""
}${
    studentResults
      ? `Student Results (recorded):
${studentResults}

`
      : ""
  }Please create the discussion guide and assessment notes.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract text
  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON
  let jsonStr = text.trim();
  jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  jsonStr = jsonStr.trim();

  try {
    const parsed = JSON.parse(jsonStr) as GeneratedDiscussion;
    return {
      discussionAnswers: parsed.discussionAnswers || "",
      assessmentNotes: parsed.assessmentNotes || "",
    };
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    console.error("Failed to parse:", jsonStr.substring(0, 500));

    // Fallback: return raw text
    return {
      discussionAnswers: text,
      assessmentNotes: "",
    };
  }
}

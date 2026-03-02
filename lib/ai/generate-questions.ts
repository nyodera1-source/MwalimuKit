import { anthropic } from "./anthropic-client";

// ─── Types ───

export interface GenerateQuestionsInput {
  grade: string;
  subject: string;
  strand: string;
  subStrand: string;
  strandContext?: string; // e.g. "Covering all strands: Numbers (Integers, Fractions); Geometry (Angles)"
  sloDescriptions: string[];
  competencies: string[];
  assessmentType: string;
  questionCount: number;
  totalMarks: number;
  cognitiveLevel?: string;
  excludeDiagrams?: boolean; // When true, AI generates text-only questions (no diagrams)
}

export interface GeneratedQuestion {
  text: string;
  marks: number;
  section: string;
  answer: string;
  cognitiveLevel: string;
  needsDiagram: boolean;
  diagramDescription?: string;
  subQuestions?: { label: string; text: string; marks: number }[];
}

// ─── Diagram subject detection ───

const DIAGRAM_SUBJECTS = [
  "Mathematics", "Integrated Science", "Biology", "Chemistry", "Physics",
  "Geography", "Agriculture", "Home Science", "Art and Design",
  "Science and Technology", "Science",
];

function isDiagramSubject(subject: string): boolean {
  return DIAGRAM_SUBJECTS.some(
    (s) => subject.toLowerCase().includes(s.toLowerCase())
  );
}

// ─── Assessment type labels ───

function getAssessmentLabel(type: string): string {
  const labels: Record<string, string> = {
    end_term: "End of Term Examination",
    mid_term: "Mid-Term Examination",
    cat: "Continuous Assessment Test (CAT)",
    formative: "Formative Assessment",
    project: "Project-Based Assessment",
    opener: "Opening Term Assessment",
  };
  return labels[type] || "Assessment";
}

// ─── Main generation function ───

export async function generateQuestions(
  input: GenerateQuestionsInput
): Promise<GeneratedQuestion[]> {
  const hasDiagrams = isDiagramSubject(input.subject) && !input.excludeDiagrams;
  const assessmentLabel = getAssessmentLabel(input.assessmentType);
  const isBroadExam = !input.strand && !input.subStrand;

  let diagramInstruction: string;
  if (input.excludeDiagrams) {
    diagramInstruction = "- DO NOT create questions that require diagrams, figures, graphs, or images. All questions must be fully answerable from text alone. Avoid phrases like 'the figure below' or 'refer to the diagram'.";
  } else if (hasDiagrams) {
    diagramInstruction = "- For questions that require a diagram/figure/graph, set needsDiagram to true and provide a clear diagramDescription explaining what image the teacher should attach";
  } else {
    diagramInstruction = "- This subject typically does not require diagrams, so set needsDiagram to false for all questions";
  }

  const systemPrompt = `You are a Kenyan CBC (Competency-Based Curriculum) assessment expert.
You create high-quality assessment items aligned to specific SLOs (Specific Learning Outcomes).

Rules:
- Use CBC-appropriate language and terminology
- Use Bloom's Taxonomy action verbs matching the cognitive level
- Questions must directly assess the given SLOs
- Marks must be reasonable and total approximately ${input.totalMarks}
- For "Section A" use short-answer/structured questions (1-5 marks each)
- For "Section B" use longer structured/essay questions (5-15 marks each)
- Include complete marking schemes with mark allocation per point
- Use Kenyan context and examples where appropriate
${isBroadExam ? "- This is a comprehensive exam covering multiple strands/topics. Spread questions across different strands for balanced coverage. Do NOT cluster questions from one topic." : ""}
${diagramInstruction}
${input.cognitiveLevel ? `- Focus on the "${input.cognitiveLevel}" cognitive level` : "- Mix cognitive levels: ~30% remember/understand, ~40% apply, ~30% analyze/evaluate"}`;

  // Build the scope line — show strand/sub-strand if specific, or broad context
  let scopeLines = "";
  if (input.strand) {
    scopeLines += `**Strand:** ${input.strand}\n`;
  }
  if (input.subStrand) {
    scopeLines += `**Sub-strand:** ${input.subStrand}\n`;
  }
  if (input.strandContext) {
    scopeLines += `**Scope:** ${input.strandContext}\n`;
  }

  const userPrompt = `Generate ${input.questionCount} assessment items for:

**Grade:** ${input.grade}
**Subject:** ${input.subject}
${scopeLines}**Assessment Type:** ${assessmentLabel}
**Target Total Marks:** ${input.totalMarks}

**Specific Learning Outcomes being assessed:**
${input.sloDescriptions.map((s, i) => `${i + 1}. ${s}`).join("\n")}

${input.competencies.length > 0 ? `**Core Competencies to integrate:**\n${input.competencies.map((c) => `- ${c}`).join("\n")}` : ""}

Return a JSON array of questions. Each question object must have:
- "text": the full question text
- "marks": number of marks
- "section": "A" or "B" (A for short questions, B for longer ones)
- "answer": complete marking scheme with mark allocation
- "cognitiveLevel": one of "remember", "understand", "apply", "analyze", "evaluate", "create"
- "needsDiagram": boolean
- "diagramDescription": string or null (describe what diagram/figure is needed if needsDiagram is true)
- "subQuestions": array of {label, text, marks} if the question has parts (a), (b), etc. — or null

Return ONLY the JSON array, no other text. Keep answers concise (key points with marks, not essays).`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract text from response
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  // Parse JSON from response (handle markdown code fences)
  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  // If the response was truncated (stop_reason = "max_tokens"), try to salvage
  // by closing the JSON array at the last complete object
  let questions: GeneratedQuestion[];
  try {
    questions = JSON.parse(jsonStr);
  } catch {
    // Likely truncated — try to find the last complete JSON object and close the array
    const lastCloseBrace = jsonStr.lastIndexOf("}");
    if (lastCloseBrace > 0) {
      const salvaged = jsonStr.substring(0, lastCloseBrace + 1) + "]";
      questions = JSON.parse(salvaged);
    } else {
      throw new Error("Failed to parse AI response. Please try with fewer questions.");
    }
  }

  // Validate and clean
  return questions.map((q) => ({
    text: q.text || "",
    marks: q.marks || 1,
    section: q.section || (q.marks >= 5 ? "B" : "A"),
    answer: q.answer || "",
    cognitiveLevel: q.cognitiveLevel || "apply",
    needsDiagram: input.excludeDiagrams ? false : (q.needsDiagram || false),
    diagramDescription: input.excludeDiagrams ? undefined : (q.diagramDescription || undefined),
    subQuestions: q.subQuestions || undefined,
  }));
}

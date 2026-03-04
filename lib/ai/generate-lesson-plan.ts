import { anthropic } from "./anthropic-client";

// ─── Types ───

export interface GenerateLessonPlanInput {
  grade: string;
  subject: string;
  strand: string;
  subStrand: string;
  sloDescriptions: string[];
  competencies: string[];
  duration: number;
}

export interface GeneratedLessonPlan {
  objectives: string;
  keyInquiryQuestion: string;
  resources: string;
  digitalResources: string;
  activitiesIntroduction: string;
  activitiesDevelopment: string;
  activitiesConclusion: string;
  assessmentStrategy: string;
  assessmentDescription: string;
}

const VALID_STRATEGIES = [
  "Written",
  "Oral",
  "Practical",
  "Project",
  "Observation",
];

// ─── Main generation function ───

export async function generateLessonPlan(
  input: GenerateLessonPlanInput
): Promise<GeneratedLessonPlan> {
  const {
    grade,
    subject,
    strand,
    subStrand,
    sloDescriptions,
    competencies,
    duration,
  } = input;

  const sloList = sloDescriptions.map((d, i) => `  ${i + 1}. ${d}`).join("\n");
  const competencyList =
    competencies.length > 0
      ? competencies.map((c) => `  - ${c}`).join("\n")
      : "  - Communication and Collaboration\n  - Critical Thinking and Problem Solving";

  const introTime = duration <= 40 ? "5" : "10";
  const conclusionTime = duration <= 40 ? "5" : "10";
  const devTime = duration - Number(introTime) - Number(conclusionTime);

  const systemPrompt = `You are an expert Kenyan CBC (Competency-Based Curriculum) lesson plan creator.
You create detailed, standards-aligned lesson plans following KICD guidelines.

IMPORTANT RULES:
- Content must be appropriate for ${grade} level
- Use Kenyan context, examples, and references where possible
- Align strictly to the provided Specific Learning Outcomes (SLOs)
- The lesson duration is ${duration} minutes — time your activities accordingly:
  * Introduction: ~${introTime} minutes (prior knowledge activation, motivation, hook)
  * Development: ~${devTime} minutes (main teaching-learning activities)
  * Conclusion: ~${conclusionTime} minutes (recap, assignment, reflection)
- For activities: use learner-centered approaches (group work, pair work, experiments, role play, demonstrations)
- Resources should be locally available in Kenyan schools
- Assessment should be formative and practical
- Write objectives starting with "By the end of the lesson, the learner should be able to:"

CRITICAL - COMPETENCY-BASED APPROACH:
CBC emphasizes developing core competencies through every lesson. You MUST:
1. Design each teaching activity to EXPLICITLY develop one or more of the selected competencies
2. In your activities description, show HOW each activity develops specific competencies
   Example: "Learners work in groups to solve problems (develops Critical Thinking and Communication)"
3. Ensure assessment measures competency demonstration, not just content recall
4. Make competencies visible and intentional — teachers should see exactly which competency each activity targets
5. Vary activities to develop different competencies throughout the lesson

Return your response as a JSON object with these exact keys:
{
  "objectives": "...",
  "keyInquiryQuestion": "...",
  "resources": "...",
  "digitalResources": "...",
  "activitiesIntroduction": "...",
  "activitiesDevelopment": "...",
  "activitiesConclusion": "...",
  "assessmentStrategy": "...",
  "assessmentDescription": "..."
}

For "assessmentStrategy", use EXACTLY one of: "Written", "Oral", "Practical", "Project", "Observation".
Each value should be a detailed string with enough content for a teacher to teach directly from.`;

  const userPrompt = `Create a complete lesson plan for:

Grade: ${grade}
Subject: ${subject}
Strand: ${strand}
Sub-Strand: ${subStrand}
Duration: ${duration} minutes

Specific Learning Outcomes (SLOs):
${sloList}

Core Competencies to EXPLICITLY develop through this lesson:
${competencyList}

IMPORTANT: Design ALL teaching activities to intentionally develop these specific competencies.
In each activity description, show HOW that activity develops the competencies (e.g., "group discussion develops Communication and Collaboration").
Ensure your assessment measures competency demonstration, not just knowledge recall.

Generate a complete, competency-focused, ready-to-teach lesson plan.`;

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
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  const defaults: GeneratedLessonPlan = {
    objectives: "",
    keyInquiryQuestion: "",
    resources: "",
    digitalResources: "",
    activitiesIntroduction: "",
    activitiesDevelopment: "",
    activitiesConclusion: "",
    assessmentStrategy: "Observation",
    assessmentDescription: "",
  };

  function normalize(parsed: Record<string, unknown>): GeneratedLessonPlan {
    let strategy = String(parsed.assessmentStrategy || "Observation");
    // Normalize: capitalize first letter
    strategy = strategy.charAt(0).toUpperCase() + strategy.slice(1).toLowerCase();
    if (!VALID_STRATEGIES.includes(strategy)) strategy = "Observation";

    return {
      objectives: String(parsed.objectives || ""),
      keyInquiryQuestion: String(parsed.keyInquiryQuestion || ""),
      resources: String(parsed.resources || ""),
      digitalResources: String(parsed.digitalResources || ""),
      activitiesIntroduction: String(parsed.activitiesIntroduction || ""),
      activitiesDevelopment: String(parsed.activitiesDevelopment || ""),
      activitiesConclusion: String(parsed.activitiesConclusion || ""),
      assessmentStrategy: strategy,
      assessmentDescription: String(parsed.assessmentDescription || ""),
    };
  }

  try {
    return normalize(JSON.parse(jsonStr));
  } catch {
    // Try to salvage truncated JSON
    const lastBrace = jsonStr.lastIndexOf("}");
    if (lastBrace > 0) {
      try {
        return normalize(JSON.parse(jsonStr.slice(0, lastBrace + 1)));
      } catch {
        // Fall through
      }
    }

    // Return raw text as objectives if all parsing fails
    return { ...defaults, objectives: text };
  }
}

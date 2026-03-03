import { anthropic } from "./anthropic-client";

// ─── Types ───

export interface SchemeEntryInput {
  week: number;
  lesson: string;
  topic: string;
  subTopic: string;
  objectives: string;
}

export interface EnhanceSchemeInput {
  grade: string;
  subject: string;
  entries: SchemeEntryInput[];
  referenceBook: string;
}

export interface EnhancedSchemeEntry {
  week: number;
  objectives: string;
  tlActivities: string;
  tlAids: string;
}

// ─── Main enhancement function ───

export async function enhanceSchemeContent(
  input: EnhanceSchemeInput
): Promise<EnhancedSchemeEntry[]> {
  const { grade, subject, entries, referenceBook } = input;

  // Batch large schemes (max 15 entries per call)
  const BATCH_SIZE = 15;
  if (entries.length > BATCH_SIZE) {
    const batches: SchemeEntryInput[][] = [];
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      batches.push(entries.slice(i, i + BATCH_SIZE));
    }
    const results = await Promise.all(
      batches.map((batch) =>
        enhanceBatch({ grade, subject, entries: batch, referenceBook })
      )
    );
    return results.flat();
  }

  return enhanceBatch(input);
}

async function enhanceBatch(
  input: EnhanceSchemeInput
): Promise<EnhancedSchemeEntry[]> {
  const { grade, subject, entries, referenceBook } = input;

  const entriesList = entries
    .map(
      (e) =>
        `Week ${e.week} (Lesson ${e.lesson}): Topic: ${e.topic} | Sub-topic: ${e.subTopic} | Objectives: ${e.objectives}`
    )
    .join("\n");

  const systemPrompt = `You are an expert Kenyan CBC (Competency-Based Curriculum) scheme of work content creator.
You enhance scheme-of-work entries with rich, practical teaching content aligned to KICD guidelines.

RULES:
- Content must be appropriate for ${grade} level
- Use Kenyan context and locally available resources
- T/L Activities must be specific and varied per sub-topic:
  * Use learner-centered approaches: group work, peer learning, experiments, field visits, role play, debates, demonstrations, think-pair-share
  * Don't just say "discussion and Q&A" — be specific about WHAT they discuss and HOW
  * Sequence activities: introduction hook → main activity → practice/consolidation
- T/L Aids must be specific to each sub-topic, not generic:
  * Name actual materials (e.g., "fraction strips", "bean seeds", "Kenya wall map")
  * Include the textbook reference: ${referenceBook || "Course textbook"}
- Objectives should start with "By the end of the lesson, the learner should be able to:"
  followed by specific, measurable outcomes using Bloom's action verbs
- Keep each field concise but specific (2-4 sentences for activities, comma-separated list for aids)

Return a JSON array where each object has:
{
  "week": <number>,
  "objectives": "...",
  "tlActivities": "...",
  "tlAids": "..."
}`;

  const userPrompt = `Enhance the following scheme of work entries for:
Grade: ${grade}
Subject: ${subject}
Reference book: ${referenceBook || "Course textbook"}

Entries to enhance:
${entriesList}

Return a JSON array with enhanced objectives, T/L activities, and T/L aids for each week entry.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 8192,
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

  function normalizeEntries(
    parsed: Record<string, unknown>[]
  ): EnhancedSchemeEntry[] {
    return parsed.map((e) => ({
      week: Number(e.week) || 0,
      objectives: String(e.objectives || ""),
      tlActivities: String(e.tlActivities || ""),
      tlAids: String(e.tlAids || ""),
    }));
  }

  try {
    return normalizeEntries(JSON.parse(jsonStr));
  } catch {
    // Try to salvage truncated JSON array
    const lastBracket = jsonStr.lastIndexOf("]");
    if (lastBracket > 0) {
      try {
        return normalizeEntries(JSON.parse(jsonStr.slice(0, lastBracket + 1)));
      } catch {
        // Try finding last complete object
        const lastBrace = jsonStr.lastIndexOf("}");
        if (lastBrace > 0) {
          try {
            const salvaged = jsonStr.slice(0, lastBrace + 1) + "]";
            // Ensure it starts with [
            const start = salvaged.indexOf("[");
            if (start >= 0) {
              return normalizeEntries(JSON.parse(salvaged.slice(start)));
            }
          } catch {
            // Fall through
          }
        }
      }
    }

    // Return empty if all parsing fails
    return [];
  }
}

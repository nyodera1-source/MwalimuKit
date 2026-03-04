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
You create detailed, professional scheme entries that teachers can use directly, with specific textbook references.

CRITICAL REQUIREMENTS:

1. OBJECTIVES - Must be ROBUST and COMPREHENSIVE:
   - Start with "By the end of the lesson, the learner should be able to:"
   - List 4-7 specific learning outcomes covering all aspects of the sub-topic
   - Use Bloom's taxonomy verbs: Explain, Discuss, Identify, Define, State, Compare, Demonstrate, etc.
   - Cover conceptual understanding, practical skills, and applications
   - Example: "Explain the importance of classification of organisms. Discuss the general principles of classification. Identify features used to classify organisms. Define taxa and taxon. Define species and explain binomial nomenclature. Explain the rules of binomial naming system. Give examples of scientific names."

2. T/L ACTIVITIES - Must include SPECIFIC PAGE REFERENCES:
   - Reference specific pages from the textbook (e.g., "Pages 1-2", "Pages 4-5", "Table 1.1", "Table 1.2", "Fig 1.1")
   - Describe specific activities: Q/A sessions with exact topics, discussions of particular concepts, explanations with examples
   - Mention specific content from those pages (e.g., "Q/A: Features for animals (body symmetry, coelom, appendages)")
   - Use varied instructional approaches: teacher exposition, group discussion, Q/A, practice exercises, demonstrations
   - Example: "Review of Classification concepts. Discussion of classification criteria - structural similarities and differences. Q/A: Features for animals (body symmetry, coelom, appendages) and plants (vascular system, reproductive structures). Detailed explanation of binomial system with two names (genus and species). Practice writing scientific names correctly - italics, capitalization rules. Q/A: Examples from Table 1.1 - human, chimpanzee, plants."

3. T/L AIDS - Should include TABLE/FIGURE REFERENCES with page numbers:
   - List specific charts, tables, and figures from the textbook (e.g., "Table 1.1", "Table 1.2", "Fig 1.1", "Fig 1.2")
   - Include page numbers where helpful (e.g., "Certificate Biology Form 3, Pages 1-2")
   - Mention specific visual aids (e.g., "Charts - Taxonomic pyramid (Fig 1.1)", "Wall charts showing hierarchy")
   - Add practical materials when relevant (e.g., "Practice writing materials", "Specimens", "Models")
   - Example: "Charts - Classification Features, Taxonomic units. Charts - Examples of scientific names (Table 1.1), Practice writing materials. Charts - Taxonomic pyramid (Fig 1.1), Wall charts showing hierarchy. Certificate Biology Form 3, Pages 1-2, Certificate Biology Form 3, Pages 2-3."

TEXTBOOK REFERENCE: ${referenceBook || "Course textbook"}
GRADE LEVEL: ${grade}

Return a JSON array where each object has:
{
  "week": <number>,
  "objectives": "...",
  "tlActivities": "...",
  "tlAids": "..."
}`;

  const userPrompt = `Create DETAILED, PROFESSIONAL scheme of work entries for:
Grade: ${grade}
Subject: ${subject}
Reference book: ${referenceBook || "Course textbook"}

Entries to enhance:
${entriesList}

IMPORTANT:
- Objectives: List 4-7 specific, measurable outcomes covering all aspects of each sub-topic
- T/L Activities: Include specific page numbers, table references, and detailed descriptions of activities
- T/L Aids: Include table/figure numbers (e.g., Table 1.1, Fig 1.2) and specific page references from the textbook

Return a JSON array with comprehensive, reference-rich content for each week entry.`;

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

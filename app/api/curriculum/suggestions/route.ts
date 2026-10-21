import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  PILOT_RESPONSE_HEADERS,
  pilotActiveSubStrandWhere,
  pilotLearningAreaScope,
} from "@/lib/curriculum/pilot";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  if (searchParams.get("type") === "carryover") {
    return getCarryoverSuggestions(request);
  }

  const subStrandId = searchParams.get("subStrandId");
  const strandId = searchParams.get("strandId");

  if (!subStrandId && !strandId) {
    return NextResponse.json({ error: "subStrandId or strandId required" }, { status: 400 });
  }

  let strandName = "";
  let subStrandName = "";
  let learningAreaName = "";
  let slos: { description: string; cognitiveLevel: string | null }[] = [];

  if (subStrandId) {
    const ss = await prisma.subStrand.findFirst({
      where: {
        id: subStrandId,
        ...pilotActiveSubStrandWhere(),
        strand: {
          subStrands: {
            some: pilotActiveSubStrandWhere(),
          },
          learningArea: {
            ...pilotLearningAreaScope(),
          },
        },
      },
      include: {
        slos: {
          where: { verification: { not: "superseded" } },
          orderBy: { order: "asc" },
          select: { description: true, cognitiveLevel: true },
        },
        strand: {
          include: { learningArea: { select: { name: true } } },
        },
      },
    });
    if (!ss) {
      return NextResponse.json(
        { error: "Curriculum topic is not available." },
        { status: 404, headers: PILOT_RESPONSE_HEADERS }
      );
    }
    subStrandName = ss.name;
    strandName = ss.strand.name;
    learningAreaName = ss.strand.learningArea.name;
    slos = ss.slos;
  } else if (strandId) {
    const s = await prisma.strand.findFirst({
      where: {
        id: strandId,
        subStrands: {
          some: pilotActiveSubStrandWhere(),
        },
        learningArea: {
          ...pilotLearningAreaScope(),
        },
      },
      include: {
        learningArea: { select: { name: true } },
        subStrands: {
          where: {
            ...pilotActiveSubStrandWhere(),
          },
          orderBy: { order: "asc" },
          select: {
            slos: {
              where: { verification: { not: "superseded" } },
              orderBy: { order: "asc" },
              select: { description: true, cognitiveLevel: true },
            },
          },
        },
      },
    });
    if (!s) {
      return NextResponse.json(
        { error: "Curriculum strand is not available." },
        { status: 404, headers: PILOT_RESPONSE_HEADERS }
      );
    }
    strandName = s.name;
    learningAreaName = s.learningArea.name;
    slos = s.subStrands.flatMap((subStrand) => subStrand.slos);
  }

  // Generate suggestions based on the SLOs and context
  const sloDescriptions = slos.map((s) => s.description);

  const objectives = sloDescriptions.length > 0
    ? `By the end of the lesson, the learner should be able to:\n${sloDescriptions.map((d) => `- ${d}`).join("\n")}`
    : "";

  const keyInquiryQuestion = generateInquiryQuestion(learningAreaName, strandName, subStrandName);

  const resources = generateResourceSuggestions(learningAreaName);

  return NextResponse.json(
    {
      objectives,
      keyInquiryQuestion,
      resources,
      sloDescriptions,
      context: { learningAreaName, strandName, subStrandName },
    },
    { headers: PILOT_RESPONSE_HEADERS }
  );
}

interface JsonRecord {
  [key: string]: unknown;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function getCarryoverSuggestions(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const gradeId = searchParams.get("gradeId");
  const learningAreaId = searchParams.get("learningAreaId");
  const term = Number(searchParams.get("term"));

  if (!gradeId || !learningAreaId || ![1, 2, 3].includes(term)) {
    return NextResponse.json(
      { error: "gradeId, learningAreaId and a valid term are required" },
      { status: 400 }
    );
  }

  const learningArea = await prisma.learningArea.findUnique({
    where: { id: learningAreaId },
    select: {
      name: true,
      gradeId: true,
      grade: { select: { level: true } },
    },
  });

  if (!learningArea || learningArea.gradeId !== gradeId) {
    return NextResponse.json({ error: "Invalid grade and learning area" }, { status: 400 });
  }

  const currentLevel = learningArea.grade.level;
  const sourceLevel = term === 1 ? currentLevel - 1 : currentLevel;
  const sourceTerm = term === 1 ? 3 : term - 1;

  if (term === 1 && (currentLevel === 7 || currentLevel === 10)) {
    return NextResponse.json({
      available: false,
      suggestions: [],
      reason: `Grade ${currentLevel} Term 1 has no previous-grade lessons to carry over.`,
    });
  }

  if (sourceLevel < 1) {
    return NextResponse.json({
      available: false,
      suggestions: [],
      reason: "There is no earlier grade available for carry-over work.",
    });
  }

  const sourceGrade = await prisma.grade.findUnique({
    where: { level: sourceLevel },
    select: { id: true, name: true },
  });
  if (!sourceGrade) {
    return NextResponse.json({
      available: false,
      suggestions: [],
      reason: `No curriculum source was found for Grade ${sourceLevel} Term ${sourceTerm}.`,
    });
  }

  const sourceLearningArea = await prisma.learningArea.findFirst({
    where: { gradeId: sourceGrade.id, name: learningArea.name },
    select: { id: true },
  });
  if (!sourceLearningArea) {
    return NextResponse.json({
      available: false,
      suggestions: [],
      reason: `${learningArea.name} is not available in ${sourceGrade.name}.`,
    });
  }

  const sourceScheme = await prisma.schemeOfWork.findFirst({
    where: {
      userId: session.user.id,
      gradeId: sourceGrade.id,
      learningAreaId: sourceLearningArea.id,
      term: sourceTerm,
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true, weeks: true },
  });
  if (!sourceScheme) {
    return NextResponse.json({
      available: false,
      suggestions: [],
      reason: `No saved ${sourceGrade.name} ${learningArea.name} Term ${sourceTerm} scheme was found for suggestions.`,
    });
  }

  const weeks = isRecord(sourceScheme.weeks) ? sourceScheme.weeks : {};
  const entries = Array.isArray(weeks.entries) ? weeks.entries : [];
  const seen = new Set<string>();
  const suggestions = entries.flatMap((rawEntry, index) => {
    if (!isRecord(rawEntry)) return [];

    const topic = text(rawEntry.topic);
    const subTopic = text(rawEntry.subTopic);
    if (!topic || topic === "Open lesson slot") return [];

    const key = `${topic}|${subTopic}|${text(rawEntry.objectives)}`;
    if (seen.has(key)) return [];
    seen.add(key);

    return [{
      id: `${sourceScheme.id}-${index}`,
      week: typeof rawEntry.week === "number" ? rawEntry.week : null,
      lesson: text(rawEntry.lesson),
      topic,
      subTopic,
      objectives: text(rawEntry.objectives),
    }];
  });

  if (suggestions.length === 0) {
    return NextResponse.json({
      available: false,
      suggestions: [],
      reason: `The ${sourceGrade.name} ${learningArea.name} Term ${sourceTerm} scheme has no curriculum lesson rows to suggest.`,
    });
  }

  return NextResponse.json({
    available: true,
    schemeId: sourceScheme.id,
    label: `${sourceGrade.name} ${learningArea.name} · Term ${sourceTerm}`,
    suggestions,
  });
}

function generateInquiryQuestion(
  learningArea: string,
  strand: string,
  subStrand: string,
): string {
  const topic = subStrand || strand;
  const questions: Record<string, string[]> = {
    "Mathematics": [
      `How can we apply ${topic.toLowerCase()} to solve real-life problems?`,
      `Why is understanding ${topic.toLowerCase()} important in everyday life?`,
    ],
    "English": [
      `How does ${topic.toLowerCase()} help us communicate more effectively?`,
      `Why is ${topic.toLowerCase()} important for academic and professional success?`,
    ],
    "Kiswahili": [
      `${topic} inasaidia vipi katika mawasiliano yetu ya kila siku?`,
      `Kwa nini ni muhimu kujifunza ${topic.toLowerCase()}?`,
    ],
    "Biology": [
      `How does understanding ${topic.toLowerCase()} help us appreciate the living world?`,
      `What role does ${topic.toLowerCase()} play in sustaining life?`,
    ],
    "Chemistry": [
      `How does ${topic.toLowerCase()} explain the changes we observe in matter?`,
      `Why is knowledge of ${topic.toLowerCase()} important in our daily lives?`,
    ],
    "Physics": [
      `How can we use ${topic.toLowerCase()} to explain phenomena around us?`,
      `What are the practical applications of ${topic.toLowerCase()}?`,
    ],
    "History and Citizenship": [
      `How has ${topic.toLowerCase()} shaped our society today?`,
      `What lessons can we learn from ${topic.toLowerCase()}?`,
    ],
    "Geography": [
      `How does ${topic.toLowerCase()} affect human activities and the environment?`,
      `Why is understanding ${topic.toLowerCase()} important for sustainable development?`,
    ],
    "Business Studies": [
      `How does ${topic.toLowerCase()} contribute to economic development?`,
      `Why is knowledge of ${topic.toLowerCase()} important for aspiring entrepreneurs?`,
    ],
    "Agriculture": [
      `How can ${topic.toLowerCase()} improve food production in Kenya?`,
      `What role does ${topic.toLowerCase()} play in sustainable farming?`,
    ],
    "Computer Science": [
      `How does ${topic.toLowerCase()} impact our digital world?`,
      `Why is understanding ${topic.toLowerCase()} important in the 21st century?`,
    ],
  };

  const areaQuestions = questions[learningArea];
  if (areaQuestions) {
    return areaQuestions[0];
  }

  return `How can understanding ${topic.toLowerCase()} help us in our daily lives?`;
}

function generateResourceSuggestions(learningArea: string): string {
  const common = "Learner's textbook, Chalkboard/whiteboard, Writing materials";

  const specific: Record<string, string> = {
    "Mathematics": `${common}, Mathematical instruments, Number charts, Graph paper, Calculator`,
    "English": `${common}, Set texts, Dictionary, Newspapers/magazines`,
    "Kiswahili": `${common}, Vitabu teule, Kamusi, Magazeti`,
    "Biology": `${common}, Microscope, Specimen, Charts and models, Hand lens`,
    "Chemistry": `${common}, Laboratory apparatus, Reagents, Periodic table chart`,
    "Physics": `${common}, Laboratory apparatus, Measuring instruments, Demonstration models`,
    "History and Citizenship": `${common}, Maps, Atlas, Historical sources, Photographs`,
    "Geography": `${common}, Maps, Atlas, Globe, Photographs, Weather instruments`,
    "Business Studies": `${common}, Business documents, Newspapers, Sample financial records`,
    "Agriculture": `${common}, Farm tools, Soil samples, Seeds, Charts`,
    "Computer Science": `${common}, Computers/laptops, Internet access, Projector`,
    "Home Science": `${common}, Kitchen equipment, Sewing materials, Nutrition charts`,
    "Fine Arts": `${common}, Drawing paper, Pencils, Paints, Brushes, Clay`,
    "Music and Dance": `${common}, Musical instruments, Audio player, Music scores`,
    "Physical Education": `${common}, Sports equipment, Whistle, Cones, First aid kit`,
  };

  return specific[learningArea] || common;
}

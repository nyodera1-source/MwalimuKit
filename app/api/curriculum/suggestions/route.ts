import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  PILOT_RESPONSE_HEADERS,
  pilotActiveSubStrandWhere,
  pilotLearningAreaScope,
} from "@/lib/curriculum/pilot";
import { getLessonGuidance } from "@/lib/curriculum/lesson-guidance";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  if (searchParams.get("type") === "carryover") {
    return getCarryoverSuggestions(request);
  }

  const subStrandId = searchParams.get("subStrandId");
  const strandId = searchParams.get("strandId");
  const selectedSloIds = new Set(
    (searchParams.get("sloIds") || "")
      .split(",")
      .map((id: string) => id.trim())
      .filter(Boolean)
  );
  const duration = Number(searchParams.get("duration")) || 40;

  if (!subStrandId && !strandId) {
    return NextResponse.json({ error: "subStrandId or strandId required" }, { status: 400 });
  }

  let strandName = "";
  let subStrandName = "";
  let learningAreaName = "";
  let lessonCount = 1;
  let slos: {
    id: string;
    description: string;
    cognitiveLevel: string | null;
    suggestedLessons: number | null;
    competencies: { competency: { id: string; name: string } }[];
  }[] = [];

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
          select: {
            id: true,
            description: true,
            cognitiveLevel: true,
            suggestedLessons: true,
            competencies: {
              select: { competency: { select: { id: true, name: true } } },
            },
          },
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
    lessonCount = Math.max(
      1,
      ss.suggestedLessons || Math.max(...ss.slos.map((slo) => slo.suggestedLessons || 1), 1),
    );
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
              select: {
                id: true,
                description: true,
                cognitiveLevel: true,
                suggestedLessons: true,
                competencies: {
                  select: { competency: { select: { id: true, name: true } } },
                },
              },
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

  // Generate defaults from the selected curriculum outcomes. Before any SLO
  // is selected, keep the response available for the topic-level context.
  const selectedSlos = selectedSloIds.size > 0
    ? slos.filter((slo) => selectedSloIds.has(slo.id))
    : [];
  const curriculumSlos = selectedSloIds.size > 0 ? selectedSlos : slos;
  const sloDescriptions = curriculumSlos.map((s) => s.description);

  const objectives = sloDescriptions.length > 0
    ? `By the end of the lesson, the learner should be able to:\n${sloDescriptions.map((d) => `- ${d}`).join("\n")}`
    : "";

  const keyInquiryQuestion = generateInquiryQuestion(learningAreaName, strandName, subStrandName);

  const resources = generateResourceSuggestions(learningAreaName, subStrandName);
  const guidance = getLessonGuidance({
    learningArea: learningAreaName,
    strand: strandName,
    subStrand: subStrandName,
    duration,
    lessonCount,
    sloDescriptions,
  });
  const activities = guidance.activities || generateActivitySuggestions(
    learningAreaName,
    subStrandName || strandName,
    sloDescriptions,
  );
  const assessment = guidance.assessment || generateAssessmentSuggestion(sloDescriptions, curriculumSlos);
  const competencyIds = Array.from(
    new Set(curriculumSlos.flatMap((slo) => slo.competencies.map((entry) => entry.competency.id)))
  );

  return NextResponse.json(
    {
      objectives,
      keyInquiryQuestion,
      resources,
      activities,
      assessment,
      lessonFocus: guidance.lessonFocus,
      lessonNumber: guidance.lessonNumber,
      lessonCount: guidance.lessonCount,
      priorKnowledge: guidance.priorKnowledge,
      vocabulary: guidance.vocabulary,
      teacherPreparation: guidance.teacherPreparation,
      valuesAndPcis: guidance.valuesAndPcis,
      safetyNotes: guidance.safetyNotes,
      differentiation: guidance.differentiation,
      homework: guidance.homework,
      competencyIds,
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

  const area = learningArea.toLowerCase();
  if (area.includes("computer") || area.includes("information and communication")) {
    return `How can we use ${topic.toLowerCase()} responsibly to solve problems in our digital world?`;
  }
  if (area.includes("sports") || area.includes("physical")) {
    return `How can practising ${topic.toLowerCase()} improve performance, health and teamwork?`;
  }
  if (area.includes("religious") || area.includes("religion")) {
    return `How can the lessons from ${topic.toLowerCase()} guide responsible choices in daily life?`;
  }
  if (area.includes("music") || area.includes("dance") || area.includes("theatre") || area.includes("film") || area.includes("creative")) {
    return `How can we use ${topic.toLowerCase()} to communicate ideas and express ourselves?`;
  }
  if (area.includes("technology") || area.includes("construction") || area.includes("aviation") || area.includes("pre-technical")) {
    return `How can understanding ${topic.toLowerCase()} help us design, make or improve useful products?`;
  }
  if (area.includes("science")) {
    return `What evidence can help us explain ${topic.toLowerCase()}?`;
  }
  if (area.includes("language") || area.includes("literature") || area.includes("fasihi") || area.includes("arabic") || area.includes("french") || area.includes("german") || area.includes("mandarin")) {
    return `How does ${topic.toLowerCase()} help us communicate, interpret texts or express ideas?`;
  }

  return `How can understanding ${topic.toLowerCase()} help us in our daily lives?`;
}

function generateResourceSuggestions(learningArea: string, subStrand: string): string {
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
    "Agriculture and Nutrition": `${common}, Farm tools, Soil samples, Seeds, Food samples, Nutrition charts`,
    "Applied Agriculture": `${common}, Farm tools, Soil samples, Seeds, Farm records, Charts`,
    "Computer Science": `${common}, Computers/laptops, Internet access, Projector`,
    "Information and Communication Technology (ICT)": `${common}, Computers/laptops, Offline digital files, Projector`,
    "General Science": `${common}, Safe specimens, Charts and models, Measuring instruments`,
    "Integrated Science": `${common}, Safe specimens, Charts and models, Measuring instruments`,
    "Wood Technology": `${common}, Wood samples or photographs, Safe hand tools, Furniture samples, Personal protective equipment`,
    "Metal Technology": `${common}, Metal samples, Technical drawings, Safe hand tools, Personal protective equipment`,
    "Building Construction": `${common}, Building material samples, Drawings, Measuring tools, Personal protective equipment`,
    "Aviation Technology": `${common}, Aircraft diagrams, Safe models, Measuring instruments, Projector`,
    "Pre-Technical Studies": `${common}, Material samples, Drawings, Measuring tools, Safe hand tools`,
    "Home Science": `${common}, Kitchen equipment, Sewing materials, Nutrition charts`,
    "Fine Arts": `${common}, Drawing paper, Pencils, Paints, Brushes, Clay`,
    "Music and Dance": `${common}, Musical instruments, Audio player, Music scores`,
    "Theatre and Film": `${common}, Scripts, Storyboards, Props, Audio-visual equipment`,
    "Creative Arts and Sports": `${common}, Art materials, Sports equipment, Whistle, Cones`,
    "Sports and Recreation": `${common}, Sports equipment, Whistle, Cones, First aid kit`,
    "Physical Education": `${common}, Sports equipment, Whistle, Cones, First aid kit`,
    "Arabic": `${common}, Arabic texts, Dictionary, Audio recordings`,
    "French": `${common}, French texts, Dictionary, Audio recordings`,
    "German": `${common}, German texts, Dictionary, Audio recordings`,
    "Mandarin Chinese": `${common}, Mandarin texts, Dictionary, Audio recordings`,
    "Fasihi ya Kiswahili": `${common}, Vitabu vya fasihi, Kamusi, Audio recordings`,
    "Literature in English": `${common}, Set texts, Dictionary, Audio recordings`,
    "Christian Religious Education": `${common}, Bible, Maps, Photographs, Community examples`,
    "Islamic Religious Education": `${common}, Qur'an, Hadith extracts, Maps, Community examples`,
    "Hindu Religious Education": `${common}, Selected religious texts, Images, Community examples`,
  };

  const subjectResources = specific[learningArea] || common;
  return subStrand
    ? `${subjectResources}, Examples and exercises on ${subStrand}`
    : subjectResources;
}

function generateActivitySuggestions(
  learningArea: string,
  topic: string,
  outcomes: string[],
) {
  const outcomeFocus = outcomes.length > 0
    ? outcomes.map((outcome) => `Learners work on: ${outcome}`).join("\n")
    : `Learners explore ${topic}.`;

  return {
    introduction: `Activate prior knowledge of ${topic} through short oral questions and a familiar example.`,
    development: `${outcomeFocus}\n\nUse guided examples, pair or group work, and learner explanations to practise the selected outcomes in ${learningArea}.`,
    conclusion: `Learners share one key idea and complete a short check for understanding based on ${topic}.`,
  };
}

function generateAssessmentSuggestion(
  outcomes: string[],
  slos: { cognitiveLevel: string | null }[],
) {
  const hasPracticalOutcome = slos.some((slo) =>
    ["apply", "analyze", "create"].includes((slo.cognitiveLevel || "").toLowerCase())
  );
  const strategy = hasPracticalOutcome ? "Observation" : "Oral";
  const focus = outcomes.length > 0
    ? outcomes.map((outcome) => `- ${outcome}`).join("\n")
    : "the selected learning outcomes";

  return {
    strategy,
    description: `Check learner responses, explanations, and classwork against the selected outcomes:\n${focus}`,
  };
}

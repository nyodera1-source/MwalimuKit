import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const subStrandId = searchParams.get("subStrandId");
  const strandId = searchParams.get("strandId");

  if (!subStrandId && !strandId) {
    return NextResponse.json({ error: "subStrandId or strandId required" }, { status: 400 });
  }

  // Fetch SLOs for the sub-strand (or all sub-strands of the strand)
  const sloWhere = subStrandId
    ? { subStrandId }
    : { subStrand: { strandId: strandId! } };

  const slos = await prisma.sLO.findMany({
    where: sloWhere,
    select: { description: true, cognitiveLevel: true },
    orderBy: { order: "asc" },
  });

  // Fetch the strand and sub-strand names for context
  let strandName = "";
  let subStrandName = "";
  let learningAreaName = "";

  if (subStrandId) {
    const ss = await prisma.subStrand.findUnique({
      where: { id: subStrandId },
      include: {
        strand: {
          include: { learningArea: { select: { name: true } } },
        },
      },
    });
    if (ss) {
      subStrandName = ss.name;
      strandName = ss.strand.name;
      learningAreaName = ss.strand.learningArea.name;
    }
  } else if (strandId) {
    const s = await prisma.strand.findUnique({
      where: { id: strandId },
      include: { learningArea: { select: { name: true } } },
    });
    if (s) {
      strandName = s.name;
      learningAreaName = s.learningArea.name;
    }
  }

  // Generate suggestions based on the SLOs and context
  const sloDescriptions = slos.map((s) => s.description);

  const objectives = sloDescriptions.length > 0
    ? `By the end of the lesson, the learner should be able to:\n${sloDescriptions.map((d) => `- ${d}`).join("\n")}`
    : "";

  const keyInquiryQuestion = generateInquiryQuestion(learningAreaName, strandName, subStrandName);

  const resources = generateResourceSuggestions(learningAreaName, strandName);

  return NextResponse.json({
    objectives,
    keyInquiryQuestion,
    resources,
    sloDescriptions,
    context: { learningAreaName, strandName, subStrandName },
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

function generateResourceSuggestions(learningArea: string, strand: string): string {
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

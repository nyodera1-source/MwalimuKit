export interface LessonGuidance {
  lessonFocus: string;
  lessonNumber: number;
  lessonCount: number;
  priorKnowledge: string;
  vocabulary: string;
  teacherPreparation: string;
  valuesAndPcis: string;
  safetyNotes: string;
  differentiation: string;
  homework: string;
  activities: {
    introduction: string;
    development: string;
    conclusion: string;
  };
  assessment: {
    strategy: string;
    description: string;
  };
}

interface LessonGuidanceInput {
  learningArea: string;
  strand: string;
  subStrand: string;
  duration: number;
  lessonCount: number;
  sloDescriptions: string[];
}

function curriculumObjectives(sloDescriptions: string[]) {
  if (sloDescriptions.length === 0) {
    return "the selected curriculum outcomes";
  }

  return sloDescriptions.map((outcome) => `- ${outcome}`).join("\n");
}

export function getLessonGuidance(input: LessonGuidanceInput): LessonGuidance {
  const duration = Math.max(30, input.duration || 40);
  const introduction = duration <= 40 ? 5 : 10;
  const conclusion = duration <= 40 ? 5 : 10;
  const development = duration - introduction - conclusion;
  const objectives = curriculumObjectives(input.sloDescriptions);
  const lessonCount = Math.max(1, input.lessonCount || 1);

  const generic: LessonGuidance = {
    lessonFocus: input.subStrand || input.strand,
    lessonNumber: 1,
    lessonCount,
    priorKnowledge: `Learners recall relevant ideas from earlier work and describe examples of ${input.subStrand || input.strand} from their surroundings.`,
    vocabulary: `${input.subStrand || input.strand}, key terms from the selected learning outcomes`,
    teacherPreparation: "Review the selected curriculum outcomes, prepare locally available resources, and organise learners for pair or group work.",
    valuesAndPcis: "Values and pertinent issues should be connected to the selected learning outcomes and the learners' local context.",
    safetyNotes: "Review the safety needs of the selected activity before the lesson and demonstrate safe use of any equipment.",
    differentiation: "Support learners with examples, word banks and mixed-ability grouping. Extend confident learners with an application or explanation task.",
    homework: `Find one example of ${input.subStrand || input.strand} in the local environment and explain how it relates to today's lesson.`,
    activities: {
      introduction: `${introduction} min\nTeacher: Activate prior knowledge with short questions and a familiar example.\nLearners: Share what they already know and make an initial prediction.\nCheck: Listen for correct vocabulary and address misconceptions before the main activity.`,
      development: `${development} min\n1. Teacher introduces the selected concept using the curriculum outcomes and prepared examples.\n2. Learners work in pairs or groups to investigate the examples and explain their findings.\n3. Groups report back while the teacher consolidates the correct ideas on the board.\nCompetencies: Communication and Collaboration; Critical Thinking and Problem Solving.`,
      conclusion: `${conclusion} min\nLearners summarise the key idea, answer an exit question and record the homework task.\nTeacher checks whether the lesson objectives were met and notes learners who need support.`,
    },
    assessment: {
      strategy: "Observation",
      description: `Assess learner explanations, participation and written work against the selected outcomes:\n${objectives}\n\nUse the exit question to identify learners who need further support.`,
    },
  };

  if (
    input.learningArea === "Wood Technology" &&
    /overview of wood technology/i.test(input.subStrand)
  ) {
    return {
      lessonFocus: "Meaning, scope and importance of Wood Technology",
      lessonNumber: 1,
      lessonCount,
      priorKnowledge: "Learners identify wooden furniture, buildings, tools and household products they have seen or used at home and in the community.",
      vocabulary: "wood technology, woodwork, timber, workshop, furniture, joinery, wood product",
      teacherPreparation: "Arrange safe wood samples or photographs of furniture, buildings and tools. Display a short list of familiar wooden products and prepare group discussion prompts.",
      valuesAndPcis: "Values: responsibility, respect and unity. PCIs: occupational safety, environmental conservation, responsible use of trees and career awareness.",
      safetyNotes: "Use photographs, blunt samples or secured tools for this introductory lesson. Remind learners not to handle sharp tools without instruction and to keep the workshop area organised.",
      differentiation: "Support: provide labelled pictures and a word bank. Extension: ask learners to compare two wooden products by use, material and user. Include learners through assigned roles such as reader, recorder, reporter and resource manager.",
      homework: "Identify three wooden products at home or in the community. Record each product, its use and the type of work or career involved in producing it.",
      activities: {
        introduction: `${introduction} min\nTeacher: Display a chair, door, tool handle or photographs of wooden products and ask: What are these made from? Where did the material come from?\nLearners: Observe, name the products and share their experiences.\nLink: Explain that Wood Technology covers the knowledge, skills and processes used to work with wood and make useful products.`,
        development: `${development} min\n1. Meaning and scope (${Math.max(5, Math.floor(development * 0.3))} min): Teacher guides learners to build a definition using the words wood, tools, processes, products and technology.\n2. Group classification (${Math.max(7, Math.floor(development * 0.35))} min): Groups classify examples such as furniture, roofing members, tool handles, doors and decorative items according to their uses.\n3. Application and careers (${Math.max(5, development - Math.max(5, Math.floor(development * 0.3)) - Math.max(7, Math.floor(development * 0.35)))} min): Learners connect products to carpentry, joinery, furniture making, timber processing, construction and design. Groups present one finding; the teacher consolidates the definition, scope and importance of Wood Technology.\nCompetencies: Communication and Collaboration through group reporting; Critical Thinking and Problem Solving through classification; Self-Efficacy through presentation.`,
        conclusion: `${conclusion} min\nTeacher: Recap the meaning, scope and importance of Wood Technology.\nLearners: Answer: (1) What is Wood Technology? (2) Name two products made using wood. (3) Name one related career.\nExit check: Each learner writes one reason why safe and responsible use of wood matters.`,
      },
      assessment: {
        strategy: "Observation",
        description: `Assess group discussion, classification and individual exit responses. Look for the ability to:\n- explain the meaning of Wood Technology in simple terms;\n- identify common wood products and their uses;\n- connect Wood Technology to at least one career;\n- demonstrate respectful collaboration and safe handling of materials.\n\nShort written check:\n1. Define Wood Technology.\n2. List two areas where Wood Technology is applied.\n3. State one reason for conserving trees used for timber.`,
      },
    };
  }

  return generic;
}
